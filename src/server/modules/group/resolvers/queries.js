/* eslint-disable no-unused-vars */
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import log from '../../../../common/log';

import FieldError from '../../../../common/FieldError';

import { authSwitch } from '../../../../common/auth/server';

import { reconcileBatchOneToOne, reconcileBatchManyToMany } from '../../../stores/sql/knex/helpers/batching';

/*eslint-disable no-unused-vars*/

export default function addResolvers(obj) {
  obj = addQueries(obj);

  return obj;
}

function addQueries(obj) {
  obj.Query.groups = authSwitch([
    {
      requiredScopes: ['group/superuser/list'],
      callback: async (obj, args, context) => {
        console.log(context.auth.groupRoles);
        let ret = await context.Group.list(args);
        return ret;
      }
    },
    {
      requiredScopes: ['group/owner/list', 'group/admin/list', 'group/member/list'],
      callback: async (obj, args, context) => {
        const userGroups = await context.Group.getGroupIdsForUserIds({ ids: [context.user.id] });
        //console.log("RESOLVER - User.groups - userGroups", userGroups)

        const gids = _.uniq(_.map(_.flatten(userGroups), u => u.groupId));
        args.ids = gids;
        //console.log("RESOLVER - User.groups - args", args)
        const groups = await context.Group.getMany(args);
        //console.log("RESOLVER - User.groups - groups", groups)

        const ret = groups;

        console.log('Query.groups - own groups', ret);
        return ret;
      }
    }
  ]);

  obj.Query.pagingGroups = authSwitch([
    {
      requiredScopes: ['group/superuser/list'],
      callback: async (obj, args, context) => {
        let ret = await context.Group.paging(args);
        return ret;
      }
    },
    {
      requiredScopes: ['group/owner/list', 'group/admin/list', 'group/member/list'],
      callback: async (obj, args, context) => {
        const userGroups = await context.Group.getGroupIdsForUserIds({ ids: [context.user.id] });
        const gids = _.uniq(_.map(_.flatten(userGroups), u => u.groupId));
        args.ids = gids;
        const ret = await context.Group.paging(args);
        return ret;
      }
    }
  ]);

  obj.Query.group = authSwitch([
    {
      requiredScopes: (obj, args, context) => {
        // console.log("group", context.auth.groupRoles)
        let hasScopes = context.auth.groupPermissions.filter(elem => elem.groupId === args.id);
        hasScopes ? ['group/ner/view', 'group/admin/view', 'group/member/view'] : ['group/superuser/view'];
      },
      presentedScopes: (obj, args, context) => {
        // console.log("group", context.auth.groupRoles)
        let permissions = context.auth.groupPermissions.filter(elem => elem.groupId === args.id);
        console.log(permissions);
        let scopes = permissions.map(elem => elem.name);
        console.log(scopes);
        return scopes;
      },
      callback: async (obj, args, context) => {
        const ret = await context.Group.get(args);
        return ret;
      }
    },
    {
      callback: async (obj, args, context) => {
        const ret = await context.Group.get(args);
        return ret;
      }
    }
  ]);

  return obj;
}
