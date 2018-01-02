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

      const uids = _.uniq(sources.map(s => s.userId));
      //console.log("RESOLVER - User.groups - uids", uids)
      const userGroups = await context.Group.getGroupIdsForUserIds({ ids: uids });
      // console.log('RESOLVER - User.groups - userGroups', userGroups);

      const gids = _.uniq(_.map(_.flatten(userGroups), u => u.groupId));
      args.ids = gids;
      args.printSQL = true;
      // console.log('RESOLVER - User.groups - args', args, matchFilter, resultFilter);
      const groups = await context.Group.getMany(args);
      // console.log('RESOLVER - User.groups - groups', groups);

      let ret = reconcileBatchManyToMany(sources, userGroups, groups, 'userId', 'groupId', matchFilter, resultFilter);
      // console.log('RESOLVER - User.groups - ret', ret);
      return ret;
    })
  };

  obj.Group.users = createBatchResolver(async (sources, args, context, info) => {
    let resolver = authSwitch([
      {
        // Someone who can view all groups, likely an admin
        requiredScopes: ['admin:group:members/list'],
        presentedScopes: userPresentedScopes(),
        callback: async (sources, args, context, info) => {
          console.log('Group.users - admin - input', sources, args, pathExtractor(info));

          const gids = _.uniq(sources.map(s => s.groupId));
          const groupUsers = await context.Group.getUserIdsForGroupIds({ ids: gids });

          const uids = _.uniq(_.map(_.flatten(groupUsers), u => u.userId));
          args.ids = uids;
          const users = await context.User.getMany(args);

          let ret = reconcileBatchManyToMany(sources, groupUsers, users, 'groupId', 'userId');
          return ret;
        }
      },

      // This authSwitch nests a filtered authBatching
      {
        // let everything in
        requiredScopes: [],
        // Worms nesting with birds
        callback: authBatching([
          {
            requiredScopes: ['group:members/list'],
            presentedScopes: groupsPresentedScopes(),
            callback: async (sources, args, context, info) => {
              console.log('Group.users - member - input', sources, args, pathExtractor(info));

              const gids = _.uniq(sources.filter(s => s && s.groupId).map(s => s.groupId));
              console.log('Group.users - member - gids', gids);

              const groupUsers = await context.Group.getUserIdsForGroupIds({ ids: gids });

              const uids = _.uniq(_.map(_.flatten(groupUsers), u => u.userId));
              args.ids = uids;
              const users = await context.User.getMany(args);

              let ret = reconcileBatchManyToMany(sources, groupUsers, users, 'groupId', 'userId');
              console.log('Group.users - member - ret', ret);
              return ret;
            }
          }, // end of group:member filter

          {
            requiredScopes: [],
            callback: async (sources, args, context, info) => {
              console.log('Group.users - public - input', sources, args, pathExtractor(info));

              const gids = _.uniq(sources.map(s => s.groupId));
              console.log('Group.users - public - gids', gids);

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

              let groupArgs = {
                ids: gids,
                joins,
                filters
              };

              const groupUsers = await context.Group.getUserIdsForGroupIds(groupArgs);

              const uids = _.uniq(_.map(_.flatten(groupUsers), u => u.userId));
              args.ids = uids;
              const users = await context.User.getMany(args);

              let ret = reconcileBatchManyToMany(sources, groupUsers, users, 'groupId', 'userId');
              console.log('Group.users - member - ret', ret);
              return ret;
            }
          } // end of grouops with public member lists
        ]) // end of nested authBatching
      }
    ]); // end of authSwitch

    try {
      let final = await resolver(sources, args, context, info);
      console.log('Groups.users - FINAL', final);
      return final;
    } catch (e) {
      log.error(e);
      throw e;
    }
  });

  return obj;
}
