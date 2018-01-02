/* eslint-disable no-unused-vars */
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import log from '../../../../common/log';

import FieldError from '../../../../common/FieldError';

import { authSwitch } from '../../../../common/auth/server';

import { reconcileBatchOneToOne, reconcileBatchManyToMany } from '../../../stores/sql/knex/helpers/batching';

export default function addResolvers(obj) {
  obj = addTypes(obj);
  return obj;
}

function addTypes(obj) {
  obj.Org = {
    id(obj) {
      return obj.orgId ? obj.orgId : obj.id;
    },
    orgId(obj) {
      return obj.orgId ? obj.orgId : obj.id;
    },
    urlName(obj) {
      return obj.urlName || null;
    },
    displayName(obj) {
      return obj.displayName || null;
    },
    locale(obj) {
      return obj.locale || null;
    },

    profile: createBatchResolver(async (sources, args, context, info) => {
      let resolve = authSwitch([
        // admin view, can see everything
        {
          requiredScopes: (sources, args, context) => {
            console.log('Group.profile - admin - requiredScopes');
            return ['admin:group:profile/view'];
          },
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
          requiredScopes: () => {
            console.log('Group.profile - default - requiredScopes');
            return [];
          },
          callback: async (sources, args, context) => {
            console.log(
              'Group.profile - default - source info',
              sources.length,
              sources[0].length,
              sources[0][0].length
            );

            // console.log("Group.profile - default", sources, args)
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
                table: 'group_profile',
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

            // search for user groups or public profiles
            const profiles = await context.Group.getProfileMany(args);

            if (sources[0].length) {
              const ret = reconcileBatchOneToOne(sources[0], profiles, 'groupId');
              // console.log("Group.profile - default - [ret]", [ret])
              return [ret];
            } else {
              // console.log("Group.profile - default - ret", ret)
              const ret = reconcileBatchOneToOne(sources, profiles, 'groupId');
              return ret;
            }
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
          requiredScopes: (sources, args, context) => {
            console.log('Org.settings - admin - requiredScopes');
            return ['admin:org:settings/view'];
          },
          callback: async (sources, args, context) => {
            // console.log("Org.settings - admin - input", sources, args)
            console.log('Org.settings - admin - source info', sources.length, sources[0].length, sources[0][0].length);

            let ids = null;
            if (sources[0].length) {
              console.log('Org.settings - admin - [sources]', sources.length, sources.map(e => e.length));
              ids = _.uniq(sources[0].map(s => s.orgId));
            } else {
              ids = _.uniq(sources.map(s => s.orgId));
            }
            args.ids = ids;
            // console.log("Org.settings - admin - ids", ids)
            const settings = await context.Org.getSettingsMany(args);
            // console.log("Org.settings - admin - settingss", settingss)
            if (sources[0].length) {
              const ret = reconcileBatchOneToOne(sources[0], settings, 'orgId');
              // console.log("Org.settings - admin - [ret]", [ret])
              return [ret];
            } else {
              // console.log("Org.settings - admin - ret", ret)
              const ret = reconcileBatchOneToOne(sources, settings, 'orgId');
              return ret;
            }
          }
        },

        // default view
        {
          requiredScopes: () => {
            console.log('Org.settings - default - requiredScopes');
            return [];
          },
          callback: async (sources, args, context) => {
            console.log(
              'Org.settings - default - source info',
              sources.length,
              sources[0].length,
              sources[0][0].length
            );

            // console.log("Org.settings - default", sources, args)
            // source orgIds
            // let sids = _.uniq(sources.map(s => s.orgId));

            const userOrgs = await context.Org.getOrgIdsForUserIds({ ids: [context.user.id] });
            // user orgIds
            const gids = _.uniq(_.map(_.flatten(userOrgs), u => u.orgId));
            args.ids = gids;

            // Or the org is public
            // Would like to prioritize the orgs the user is a member of, perhaps it is a frontend concern?
            args.filters = [
              {
                table: 'org_settings',
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

            // search for user orgs or public settings
            const settings = await context.Org.getSettingsMany(args);

            if (sources[0].length) {
              const ret = reconcileBatchOneToOne(sources[0], settings, 'orgId');
              // console.log("Org.settings - default - [ret]", [ret])
              return [ret];
            } else {
              // console.log("Org.settings - default - ret", ret)
              const ret = reconcileBatchOneToOne(sources, settings, 'orgId');
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

  obj.OrgProfile = {
    domain(obj) {
      return obj.domain || null;
    },
    description(obj) {
      return obj.description || null;
    }
  };

  return obj;
}
