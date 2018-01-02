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
      requiredScopes: ['admin:user/list'],
      callback: async (obj, args, context) => {
        let ret = await context.User.list(args);
        return ret;
      }
    },
    {
      requiredScopes: ['user/list'],
      callback: async (sources, args, context) => {
        // insert public filter, current filters become post filters
        args.filters = [
          {
            bool: 'and',
            table: 'users',
            field: 'is_public',
            boolValue: true,
            postfiltersBool: 'and',
            postfilters: args.filters
          }
        ];

        args.printSQL = true;

        let ret = await context.User.list(args);
        return ret;
      }
    }
  ]);

  obj.Query.pagingUsers = authSwitch([
    {
      requiredScopes: ['admin:user/list'],
      callback: async (obj, args, context) => {
        const ret = await context.User.paging(args);
        return ret;
      }
    },
    {
      requiredScopes: ['user/list'],
      callback: async (obj, args, context) => {
        // insert public filter, current filters become post filters
        args.filters = [
          {
            bool: 'and',
            table: 'users',
            field: 'is_public',
            boolValue: true,
            postfiltersBool: 'and',
            postfilters: args.filters
          }
        ];

        args.printSQL = true;

        const ret = await context.User.paging(args);
        return ret;
      }
    }
  ]);

  // This one switches between search and searchPublic based on the auth
  obj.Query.searchUsers = authSwitch([
    {
      requiredScopes: ['admin:user/list'],
      callback: async (obj, args, context) => {
        const ret = await context.User.search(args);
        return ret;
      }
    },
    {
      requiredScopes: ['user/list'],
      callback: async (obj, args, context) => {
        // insert public filter, current filters become post filters
        args.filters = [
          {
            bool: 'and',
            table: 'users',
            field: 'is_public',
            boolValue: true,
            postfiltersBool: 'and',
            postfilters: args.filters
          }
        ];

        const ret = await context.User.search(args);
        return ret;
      }
    }
  ]);

  obj.Query.user = authSwitch([
    /// private view...
    {
      requiredScopes: (obj, args, context) => {
        return args.id === context.user.id ? ['user:self/view'] : ['admin:user/view'];
      },
      callback: async (obj, args, context) => {
        const ret = await context.User.get(args);
        return ret;
      }
    },
    /// public view...
    {
      requiredScopes: ['user/view'],
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
