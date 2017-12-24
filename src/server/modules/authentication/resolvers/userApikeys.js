import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

// import { withAuth } from '../../../../common/authValidation';
import { reconcileBatchOneToMany } from '../../../sql/helpers';

export default function addResolvers(obj) {
  obj = addTypeResolvers(obj);
  obj = addMutations(obj);
  return obj;
}

function addTypeResolvers(obj) {
  obj.UserAuth.apikeys = createBatchResolver(async (source, args, context) => {
    let ids = _.uniq(source.map(s => s.userId));
    const apikeys = await context.Authn.getApiKeysForUsers(ids);
    const ret = reconcileBatchOneToMany(source, apikeys, 'userId');
    return ret;
  });

  return obj;
}

function addMutations(obj) {
  obj.Mutation.createUserApiKey = async (obj, args, context) => {
    try {
      const existing = await context.Authn.searchUserApiKey(args.id, args.name);
      if (existing) {
        return {
          apikey: null,
          errors: [
            {
              field: 'general',
              message: 'User already has a key with that name'
            }
          ]
        };
      }

      const apikey = await context.Authn.createUserApiKey(args.id, args.name);
      return {
        apikey: {
          name: args.name,
          key: apikey
        },
        errors: null
      };
    } catch (e) {
      return { apikey: null, errors: [e] };
    }
  };

  obj.Mutation.deleteUserApiKey = async (obj, args, context) => {
    try {
      const existing = await context.Authn.searchUserApiKey(args.id, args.name);
      if (!existing) {
        return {
          apikey: null,
          errors: [
            {
              field: 'general',
              message: 'User has no key with that name'
            }
          ]
        };
      }

      const ret = await context.Authn.deleteUserApiKey(args.id, args.name);
      if (!ret) {
        return {
          apikey: null,
          errors: [
            {
              field: 'general',
              message: 'An error ocurred, please try again later.'
            }
          ]
        };
      }
      return {
        apikey: null,
        errors: null
      };
    } catch (e) {
      return { apikey: null, errors: [e] };
    }
  };

  return obj;
}
