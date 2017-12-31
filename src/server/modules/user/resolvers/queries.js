/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import log from '../../../../common/log';

import FieldError from '../../../../common/FieldError';

import { authSwitch } from '../../../../common/auth/server';

import { reconcileBatchOneToOne, reconcileBatchManyToMany } from '../../../stores/sql/knex/helpers/batching';

export default function addResolvers(obj) {
  obj = addQueries(obj);
  return obj;
}

function addQueries(obj) {
  obj.Query.users = authSwitch([
    {
      requiredScopes: ['user/superuser/list', 'user/admin/list', 'user/editor/list'],
      callback: async (obj, args, context) => {
        let ret = await context.User.list(args);
        return ret;
      }
    },
    {
      requiredScopes: ['user/viewer/list'],
      callback: async (obj, args, context) => {
        let ret = await context.User.list(args);
        return ret;
      }
    },
    {
      requiredScopes: ['user/visitor/list'],
      callback: async (obj, args, context) => {
        let ret = await context.User.list(args);
        return ret;
      }
    }
  ]);

  obj.Query.pagingUsers = authSwitch([
    {
      requiredScopes: ['user/superuser/list', 'user/admin/list', 'user/editor/list'],
      callback: async (obj, args, context) => {
        const ret = await context.User.paging(args);
        return ret;
      }
    },
    {
      requiredScopes: ['user/viewer/list'],
      callback: async (obj, args, context) => {
        const ret = await context.User.paging(args);
        return ret;
      }
    },
    {
      requiredScopes: ['user/visitor/list'],
      callback: async (obj, args, context) => {
        const ret = await context.User.paging(args);
        return ret;
      }
    }
  ]);

  obj.Query.searchUsers = authSwitch([
    {
      requiredScopes: ['user/superuser/list', 'user/admin/list', 'user/editor/list'],
      callback: async (obj, args, context) => {
        const ret = await context.User.search(args);
        return ret;
      }
    },
    {
      requiredScopes: ['user/viewer/list'],
      callback: async (obj, args, context) => {
        const ret = await context.User.searchPublic(args);
        return ret;
      }
    },
    {
      requiredScopes: ['user/visitor/list'],
      callback: async (obj, args, context) => {
        const ret = await context.User.searchPublic(args);
        return ret;
      }
    }
  ]);

  obj.Query.user = authSwitch([
    {
      requiredScopes: ['user/superuser/view', 'user/admin/view', 'user/editor/view'],
      callback: async (obj, args, context) => {
        const ret = await context.User.get(args);
        return ret;
      }
    },
    {
      requiredScopes: ['user/self/view'],
      callback: async (obj, args, context) => {
        const ret = await context.User.get(args);
        return ret;
      }
    },
    {
      requiredScopes: ['user/viewer/view'],
      callback: async (obj, args, context) => {
        const ret = await context.User.get(args);
        return ret;
      }
    },
    {
      requiredScopes: ['user/visitor/view'],
      callback: async (obj, args, context) => {
        const ret = await context.User.get(args);
        return ret;
      }
    }
  ]);

  obj.Query.currentUser = async (obj, args, context) => {
    if (context.user) {
      let ret = await context.User.get({ id: context.user.id });
      return ret;
    } else {
      return null;
    }
  };

  return obj;
}
