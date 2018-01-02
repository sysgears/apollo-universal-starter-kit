/* eslint-disable no-unused-vars */
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import log from '../../../../common/log';

import FieldError from '../../../../common/FieldError';

import { authSwitch } from '../../../../common/auth/server';

import { reconcileBatchOneToOne, reconcileBatchManyToMany } from '../../../stores/sql/knex/helpers/batching';

import { groupPresentedScopes } from '../../common/helpers/resolvers/presentedScopes';

export default function addResolvers(obj) {
  obj = addQueries(obj);
  return obj;
}

function addQueries(obj) {
  obj.Query.groups = authSwitch([
    {
      requiredScopes: ['admin:group/list'],
      callback: async (obj, args, context) => {
        // console.log(context.auth.groupRoles);
        let ret = await context.Group.list(args);
        return ret;
      }
    },
    {
      requiredScopes: ['group/list'],
      callback: async (obj, args, context) => {
        const userGroups = await context.Group.getGroupIdsForUserIds({ ids: [context.user.id] });

        const gids = _.uniq(_.map(_.flatten(userGroups), u => u.groupId));
        args.ids = gids;

        // Or the group is public
        // Would like to prioritize the groups the user is a member of, perhaps it is a frontend concern?
        args.filters = [
          {
            prefilters: args.filters,
            bool: 'or',
            table: 'groups',
            field: 'is_public',
            boolValue: true
          }
        ];

        const groups = await context.Group.list(args);
        //console.log("RESOLVER - User.groups - groups", groups)

        const ret = groups;

        return ret;
      }
    }
  ]);

  obj.Query.pagingGroups = authSwitch([
    {
      requiredScopes: ['admin:group/list'],
      callback: async (obj, args, context) => {
        // console.log(context.auth.groupRoles);
        let ret = await context.Group.paging(args);
        return ret;
      }
    },
    {
      requiredScopes: ['group/list'],
      callback: async (obj, args, context) => {
        const userGroups = await context.Group.getGroupIdsForUserIds({ ids: [context.user.id] });

        const gids = _.uniq(_.map(_.flatten(userGroups), u => u.groupId));
        args.ids = gids;

        // Or the group is public
        // Would like to prioritize the groups the user is a member of, perhaps it is a frontend concern?
        args.filters = [
          {
            prefilters: args.filters,
            bool: 'or',
            table: 'groups',
            field: 'is_public',
            boolValue: true
          }
        ];

        const groups = await context.Group.paging(args);
        //console.log("RESOLVER - User.groups - groups", groups)

        const ret = groups;

        return ret;
      }
    }
  ]);

  obj.Query.searchGroups = authSwitch([
    {
      requiredScopes: ['admin:group/list'],
      callback: async (obj, args, context) => {
        // console.log(context.auth.groupRoles);
        let ret = await context.Group.search(args);
        return ret;
      }
    },
    {
      requiredScopes: ['group/list'],
      callback: async (obj, args, context) => {
        const userGroups = await context.Group.getGroupIdsForUserIds({ ids: [context.user.id] });

        const gids = _.uniq(_.map(_.flatten(userGroups), u => u.groupId));
        args.ids = gids;

        // Or the group is public
        // Would like to prioritize the groups the user is a member of, perhaps it is a frontend concern?
        args.filters = [
          {
            prefilters: args.filters,
            bool: 'or',
            table: 'groups',
            field: 'is_public',
            boolValue: true
          }
        ];

        const groups = await context.Group.search(args);
        //console.log("RESOLVER - User.groups - groups", groups)

        const ret = groups;

        return ret;
      }
    }
  ]);

  obj.Query.group = authSwitch([
    // private group, with member privileges
    {
      requiredScopes: (obj, args, context) => {
        // console.log("group", context.auth.groupRoles)
        let hasScopes = context.auth.groupPermissions.filter(elem => elem.groupId === args.id);
        hasScopes ? ['group:member/view'] : ['admin:group/view'];
      },
      presentedScopes: groupPresentedScopes,
      callback: async (obj, args, context) => {
        const ret = await context.Group.get(args);
        return ret;
      }
    },

    // public group
    {
      requiredScopes: async (_, args, context) => {
        let group = await context.Group.get(args);
        // console.log("Group:\n", group)
        return group.isPublic ? [] : ['skip'];
      },
      callback: async (obj, args, context) => {
        const ret = await context.Group.get(args);
        return ret;
      }
    }
  ]);

  return obj;
}
