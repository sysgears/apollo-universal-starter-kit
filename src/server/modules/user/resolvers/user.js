/*eslint-disable no-unused-vars*/
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
  obj.User = {
    id(obj) {
      return obj.userId ? obj.userId : obj.id;
    },
    userId(obj) {
      return obj.userId ? obj.userId : obj.id;
    },

    profile: authSwitch([
      {
        // superuser/ admin view
        requiredScopes: () => {
          // console.log("User.profile - admin")
          return ['user:profile/superuser/view', 'user:profile/admin/view', 'user:profile/editor/view'];
        },
        callback: createBatchResolver(async (source, args, context) => {
          let ids = _.uniq(source.map(s => s.userId));
          args.ids = ids;
          const profiles = await context.User.getProfileMany(args);
          const ret = reconcileBatchOneToOne(source, profiles, 'userId');
          return ret;
        })
      },
      {
        // self view
        requiredScopes: (obj, args, context) => {
          // console.log("User.profile - self")
          return args.id === context.user.id ? ['user:profile/self/view'] : ['skip'];
        },
        callback: createBatchResolver(async (source, args, context) => {
          let ids = _.uniq(source.map(s => s.userId));
          args.ids = ids;
          const profiles = await context.User.getProfileMany(args);
          const ret = reconcileBatchOneToOne(source, profiles, 'userId');
          return ret;
        })
      },
      {
        // default view
        requiredScopes: () => {
          // console.log("User.profile - default")
          return [];
        },
        callback: createBatchResolver(async (source, args, context) => {
          let ids = _.uniq(source.map(s => s.userId));
          args.ids = ids;
          const profiles = await context.User.getProfilePublicMany(args);
          const ret = reconcileBatchOneToOne(source, profiles, 'userId');
          return ret;
        })
      }
    ])
  };

  obj.UserProfile = {
    displayName(obj) {
      return obj.displayName || null;
    },
    firstName(obj) {
      return obj.firstName || null;
    },
    middleName(obj) {
      return obj.middleName || null;
    },
    lastName(obj) {
      return obj.lastName || null;
    },
    title(obj) {
      return obj.title || null;
    },
    suffix(obj) {
      return obj.suffix || null;
    },
    language(obj) {
      return obj.language || null;
    },
    locale(obj) {
      return obj.locale || null;
    },
    emails(obj) {
      return obj.emails || null;
    }
  };

  return obj;
}
