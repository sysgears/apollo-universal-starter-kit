/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import FieldError from '../../../common/FieldError';
import { withAuth } from '../../../common/authValidation';
import { reconcileBatchOneToOne } from '../../sql/helpers';

export default pubsub => ({
  Query: {
    serviceaccounts: (obj, args, context) => {
      return context.ServiceAccount.list(args);
    },
    serviceaccount: (obj, { id }, context) => {
      return context.ServiceAccount.get(id);
    }
  },

  ServiceAccount: {
    profile: createBatchResolver(async (source, args, context) => {
      // shortcut for other resolver paths which pull the profile with their call
      if (source[0].displayName) {
        return source;
      }
      let ids = _.uniq(source.map(s => s.saId));
      const profiles = await context.SvcAcct.getProfileMany(ids);
      const ret = reconcileBatchOneToOne(source, profiles, 'saId');
      return ret;
    })
  },

  ServiceAccountProfile: {
    displayName(obj) {
      return obj.displayName;
    },
    description(obj) {
      return obj.description;
    }
  },

  Mutation: {
    addServiceAccount: async (obj, { input }, context) => {
      try {
        const e = new FieldError();
        let serviceaccount;

        return { serviceaccount };
      } catch (e) {
        return { errors: e };
      }
    },
    editServiceAccount: async (obj, { input }, context) => {
      try {
        const e = new FieldError();
        let serviceaccount;

        return { serviceaccount };
      } catch (e) {
        return { errors: e };
      }
    },
    deleteServiceAccount: async (obj, { id }, context) => {
      try {
        const e = new FieldError();
        let serviceaccount;

        return { serviceaccount };
      } catch (e) {
        return { errors: e };
      }
    }
  },
  Subscription: {}
});
