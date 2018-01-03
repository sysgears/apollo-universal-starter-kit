/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import log from '../../../../common/log';
import FieldError from '../../../../common/FieldError';
import { authSwitch, authBatching } from '../../../../common/auth/server';

import {
  userPresentedScopes,
  groupPresentedScopes,
  groupsPresentedScopes
} from '../../common/helpers/resolvers/presentedScopes';
import { pathExtractor, pathProcessor } from '../../common/helpers/resolvers/path';
import { reconcileBatchOneToOne, reconcileBatchManyToMany } from '../../common/helpers/resolvers/batching';

export default function addResolvers(obj) {
  obj = addTypes(obj);
  return obj;
}

function addTypes(obj) {
  obj.User = {
    groups: createBatchResolver(async (sources, args, context, info) => {
      // console.log('User.groups', sources, args);

      let matchFilter = null;
      let resultFilter = null;

      // pathProcessor traverses the path from here to the entry looking for tags
      // When it finds a path element in the keys of a handler, it executes the callback.
      // It has twoi boolean options, skipFirst and doAll (by default it returns on the first match)
      // This is the creation function, the pathProcessor is executed below.
      let pp = pathProcessor({
        skipFirst: true,
        handlers: [
          // If we find org before we find group, then our context is the org
          // So we should only return groups which are also in this org
          {
            keys: ['org', 'orgs'],
            callback: (sources, args, context, info) => {
              let oids = _.uniq(sources.map(s => s.orgId));

              let joins = [];
              joins.push({
                table: 'orgs_groups',
                join: 'left',
                args: ['orgs_groups.group_id', 'groups.id']
              });

              let filters = [];
              filters.push({
                bool: 'and',
                table: 'orgs_groups',
                field: 'org_id',
                compare: 'in',
                values: oids
              });

              args.joins = args.joins ? args.joins.concat(joins) : joins;
              args.filters = args.filters ? args.filters.concat(filters.slice(1)) : filters;
              args.selectOverride = ['*'];

              resultFilter = 'orgId';
            }
          },

          // Otherwise only groups...? forgot why we need the filter here
          {
            keys: ['group', 'groups'],
            callback: () => {
              resultFilter = 'groupId';
            }
          }
        ]
      });

      // Now call our path processor
      pp(sources, args, context, info);

      // Get the user ids from the sources and lookup their groups
      const uids = _.uniq(sources.map(s => s.userId));
      const userGroups = await context.Group.getGroupIdsForUserIds({ ids: uids });

      // Extract the group ids from the last call's results and add to the arguments
      const gids = _.uniq(_.map(_.flatten(userGroups), u => u.groupId));
      args.ids = gids;

      // Now get our group details for the list
      const groups = await context.Group.getMany(args);

      // Resolve the groups to the users for the batch processing
      let ret = reconcileBatchManyToMany(sources, userGroups, groups, 'userId', 'groupId', matchFilter, resultFilter);
      return ret;
    })
  };

  // Batch resolver for the members of groups
  obj.Group.users = createBatchResolver(async (sources, args, context, info) => {
    // authSwitch, first clause is a shortcut for admins, second clause is a authBatching handler
    // authSwitch takes a series of 'scopings', testing scopes and exectuting the first passing callback.
    let resolver = authSwitch([
      {
        // Someone who can view all groups, likely an admin or application owner
        requiredScopes: ['admin:group:members/list'],

        // 'admin:*' only appears in the user roles and scopes
        // so present the user roles and their pemissions
        presentedScopes: userPresentedScopes(),

        // return all of the users for groups, unfiltered
        callback: async (sources, args, context, info) => {
          // get the users for the groups
          const gids = _.uniq(sources.map(s => s.groupId));
          const groupUsers = await context.Group.getUserIdsForGroupIds({ ids: gids });

          // get the user details
          const uids = _.uniq(_.map(_.flatten(groupUsers), u => u.userId));
          args.ids = uids;
          const users = await context.User.getMany(args);

          // resolve the batch and return
          let ret = reconcileBatchManyToMany(sources, groupUsers, users, 'groupId', 'userId');
          return ret;
        }
      },

      // This authSwitch nests a filtered authBatching
      {
        // let everything in, so we just let the default scopes be used and don't specify presentedScopes
        requiredScopes: [],

        // authBatching, uses all of the handlers to filter the sources progressively.
        // each callback will only receive the sources which pass its scoping validation, the others will be null, so we need to be aware and filter them out, or shit bugs out
        // Once a source is passed and resolved, later scopings will not see it.
        // authBatching will reassemble the results for return from the createBatchResolver,
        // also inserting permission denied for elements which don't pass any scoping.
        callback: authBatching([
          {
            // Check that the user has membership listing privileges for any of the groups
            requiredScopes: ['group:members/list'],

            // present the currentUser group roles and permissions
            // groupsPresentedScopes will only return the groups
            // where the requesting users has the required scope for the group in question
            presentedScopes: groupsPresentedScopes(),

            // We should now have a filtered list of only the groups the user has permissions for
            callback: async (sources, args, context, info) => {
              // get the groups
              const gids = _.uniq(sources.filter(s => s && s.groupId).map(s => s.groupId));
              const groupUsers = await context.Group.getUserIdsForGroupIds({ ids: gids });

              // get all of the users for the groups
              const uids = _.uniq(_.map(_.flatten(groupUsers), u => u.userId));
              args.ids = uids;
              const users = await context.User.getMany(args);

              // reconcile the partial batch
              let ret = reconcileBatchManyToMany(sources, groupUsers, users, 'groupId', 'userId');
              return ret;
            }
          }, // end of group:member filter

          // now we will look for groups with public memberlist settings
          {
            // so we let evertying in
            requiredScopes: [],
            callback: async (sources, args, context, info) => {
              // prep so values for our library call arguments
              const gids = _.uniq(sources.map(s => s.groupId));

              let joins = [
                {
                  table: 'group_settings',
                  join: 'left',
                  args: ['groups_users.group_id', 'group_settings.group_id']
                }
              ];

              let filters = [
                {
                  table: 'group_settings',
                  field: 'memberlist_is_public',
                  compare: '=',
                  value: true
                }
              ];

              // assemble the args object and get the groups with public member lists
              let groupArgs = {
                ids: gids,
                joins,
                filters
              };
              const groupUsers = await context.Group.getUserIdsForGroupIds(groupArgs);

              // get the users
              const uids = _.uniq(_.map(_.flatten(groupUsers), u => u.userId));
              args.ids = uids;
              const users = await context.User.getMany(args);

              // reconcile the partial batch
              let ret = reconcileBatchManyToMany(sources, groupUsers, users, 'groupId', 'userId');
              return ret;
            }
          } // end of grouops with public member lists
        ]) // end of nested authBatching
      }
    ]); // end of authSwitch

    // So at this point, nothing has actually been processed !!
    // All of the above was getting things ready.
    // So lets do some work and return the results
    let final = await resolver(sources, args, context, info);
    // console.log('Groups.users - FINAL', final);
    return final;
  });

  return obj;
}
