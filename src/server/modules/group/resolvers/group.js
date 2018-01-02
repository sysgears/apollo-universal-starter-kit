/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import log from '../../../../common/log';
import FieldError from '../../../../common/FieldError';
import { authSwitch } from '../../../../common/auth/server';

import { userPresentedScopes, groupPresentedScopes } from '../../common/helpers/resolvers/presentedScopes';
import { pathExtractor } from '../../common/helpers/resolvers/path';
import { reconcileBatchOneToOne, reconcileBatchManyToMany } from '../../common/helpers/resolvers/batching';

export default function addResolvers(obj) {
  obj = addTypes(obj);
  return obj;
}

function addTypes(obj) {
  obj.Group = {
    id(obj) {
      return obj.groupId ? obj.groupId : obj.id;
    },

    profile: createBatchResolver(async (sources, args, context, info) => {
      let resolve = authSwitch([
        // admin view, can see everything
        {
          requiredScopes: ['admin:group:profile/[view,list]'],
          presentedScopes: userPresentedScopes(),
          callback: async (sources, args, context) => {
            // console.log("Group.profile - admin - input", sources, args)
            console.log('Group.profile - admin - source info', sources.length, sources[0].length, sources[0][0].length);

            let ids = null;
            if (sources[0].length) {
              console.log('Group.profile - admin - [sources]', sources.length, sources.map(e => e.length));
              ids = _.uniq(sources[0].map(s => s.groupId));
            } else {
              ids = _.uniq(sources.map(s => s.groupId));
            }
            args.ids = ids;
            // console.log("Group.profile - admin - ids", ids)
            const profiles = await context.Group.getProfileMany(args);
            // console.log("Group.profile - admin - profiles", profiles)
            if (sources[0].length) {
              const ret = reconcileBatchOneToOne(sources[0], profiles, 'groupId');
              // console.log("Group.profile - admin - [ret]", [ret])
              return [ret];
            } else {
              // console.log("Group.profile - admin - ret", ret)
              const ret = reconcileBatchOneToOne(sources, profiles, 'groupId');
              return ret;
            }
          }
        },

        // default view
        {
          requiredScopes: [],
          callback: async (sources, args, context) => {
            // Get the groups for the requesting user
            const userGroups = await context.Group.getGroupIdsForUserIds({ ids: [context.user.id] });
            const gids = _.uniq(_.map(_.flatten(userGroups), u => u.groupId));
            args.ids = gids;

            // Or the group is public
            args.mergeBool = 'or';
            args.filters = [
              {
                table: 'group_profile',
                field: 'is_public',
                boolValue: true,
                postfiltersBool: args.filters ? 'or' : null,
                postfilters: args.filters || null
              }
            ];
            // Would like to prioritize the groups the user is a member of, perhaps it is a frontend concern?

            // search for user groups or public profiles
            const profiles = await context.Group.getProfileMany(args);

            if (sources[0].length) {
              const ret = reconcileBatchOneToOne(sources[0], profiles, 'groupId');
              console.log('Group.profile - default - [ret]');
              return [ret];
            } else {
              const ret = reconcileBatchOneToOne(sources, profiles, 'groupId');
              console.log('Group.profile - default - ret', ret);
              return ret;
            }

            /*
            // merge results with sources
            const ret = reconcileBatchOneToOne(sources, profiles, 'groupId');
            return ret;
            */
          }
        }
      ]);

      // finally, actually call authSwitcher
      let ret = await resolve(sources, args, context, info);
      // console.log("User.profile: RETTTT", ret)
      return ret || sources;
    }),

    settings: createBatchResolver(async (sources, args, context, info) => {
      let resolve = authSwitch([
        // admin view, can see everything
        {
          requiredScopes: ['admin:group:members/list'],
          presentedScopes: userPresentedScopes(),
          callback: async (sources, args, context) => {
            // console.log("Group.settings - admin - input", sources, args)
            console.log(
              'Group.settings - admin - source info',
              sources.length,
              sources[0].length,
              sources[0][0].length
            );

            let ids = null;
            if (sources[0].length) {
              console.log('Group.settings - admin - [sources]', sources.length, sources.map(e => e.length));
              ids = _.uniq(sources[0].map(s => s.groupId));
            } else {
              ids = _.uniq(sources.map(s => s.groupId));
            }
            args.ids = ids;
            // console.log("Group.settings - admin - ids", ids)
            const settings = await context.Group.getSettingsMany(args);
            // console.log("Group.settings - admin - settingss", settingss)
            if (sources[0].length) {
              const ret = reconcileBatchOneToOne(sources[0], settings, 'groupId');
              // console.log("Group.settings - admin - [ret]", [ret])
              return [ret];
            } else {
              // console.log("Group.settings - admin - ret", ret)
              const ret = reconcileBatchOneToOne(sources, settings, 'groupId');
              return ret;
            }
          }
        },

        // default view
        {
          requiredScopes: () => {
            console.log('Group.settings - default - requiredScopes');
            return [];
          },
          callback: async (sources, args, context) => {
            console.log(
              'Group.settings - default - source info',
              sources.length,
              sources[0].length,
              sources[0][0].length
            );

            // console.log("Group.settings - default", sources, args)
            // source groupIds
            // let sids = _.uniq(sources.map(s => s.groupId));

            const userGroups = await context.Group.getGroupIdsForUserIds({ ids: [context.user.id] });
            // user groupIds
            const gids = _.uniq(_.map(_.flatten(userGroups), u => u.groupId));
            args.ids = gids;

            // Or the group is public
            // Would like to prioritize the groups the user is a member of, perhaps it is a frontend concern?
            args.filters = [
              {
                table: 'group_settings',
                field: 'is_public',
                boolValue: true,
                postfiltersBool: args.filters ? 'or' : null,
                postfilters: args.filters || null
              }
            ];
            args.mergeBool = 'or';

            args.printSQL = true;
            args.debug = {
              filters: true
            };

            // search for user groups or public settings
            const settings = await context.Group.getSettingsMany(args);

            if (sources[0].length) {
              const ret = reconcileBatchOneToOne(sources[0], settings, 'groupId');
              // console.log("Group.settings - default - [ret]", [ret])
              return [ret];
            } else {
              // console.log("Group.settings - default - ret", ret)
              const ret = reconcileBatchOneToOne(sources, settings, 'groupId');
              return ret;
            }
          }
        }
      ]);

      // finally, actually call authSwitcher
      let ret = await resolve(sources, args, context, info);
      return ret || sources;
    })
  };

  obj.GroupProfile = {
    description(obj) {
      return obj.description || null;
    }
  };

  return obj;
}
