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
      // setup authSwitcher, the call is at the other end, so we also return
      const resolve = authSwitch([
        // self view
        {
          requiredScopes: (sources, args, context) => {
            // current user and only source requested?
            if (context.auth.path.includes('currentUser') && sources.length === 1) {
              let reqd = sources[0].userId === context.user.id ? ['user:self/view'] : ['deny'];
              return reqd;
            }
            // otherwise, does not apply
            return ['skip'];
          },
          callback: async (sources, args, context) => {
            // console.log("User.profile - self - callback / sources", sources)
            let ids = _.uniq(sources.map(s => s.userId));
            args.ids = ids;
            // console.log("User.profile - self - callback / args", args)
            const profiles = await context.User.getProfileMany(args);
            // console.log("User.profile - self - callback / profile", profiles)
            const ret = reconcileBatchOneToOne(sources, profiles, 'userId');
            return ret;
          }
        },

        // admin view
        {
          requiredScopes: ['admin:user:profile/view'],
          callback: async (sources, args, context, info) => {
            let ids = _.uniq(sources.map(s => s.userId));
            args.ids = ids;
            const profiles = await context.User.getProfileMany(args);
            const ret = reconcileBatchOneToOne(sources, profiles, 'userId');
            return ret;
          }
        },

        // related or permitted view??
        // dependent upon path??
        // filtered by source element callback...
        // what about public / private settings on profile
        //
        // really just need good library functions for the type

        // default view
        {
          requiredScopes: ['user:profile/view'],
          callback: async (sources, args, context, info) => {
            // console.log("User.profile - public", sources)
            let ids = _.uniq(sources.map(s => s.userId));
            args.ids = ids;
            args.filters = [
              {
                prefilters: args.filters,
                bool: 'and',
                table: 'user_profile',
                field: 'is_public',
                compare: '=',
                boolValue: true
              }
            ];

            args.printSQL = true;
            args.debug = {
              filters: true
            };

            // console.log("User.profile - public - args", args)
            const profiles = await context.User.getProfileMany(args);
            // console.log("User.profile - public - profiles", profiles)
            const ret = reconcileBatchOneToOne(sources, profiles, 'userId');
            // console.log("User.profile - public - ret", ret)
            return ret;
          }
        }
      ]);

      // finally, actually call authSwitcher
      let ret = await resolve(sources, args, context, info);
      // console.log("User.profile: RETTTT", ret)
      return ret || sources;
    }) // end of obj.User.profile
  }; // end of obj.User

  obj.UserProfile = {
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
    emails(obj) {
      return obj.emails || null;
    }
  };

  return obj;
}
