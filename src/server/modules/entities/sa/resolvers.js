/*eslint-disable no-unused-vars*/
import { pick } from 'lodash';
import FieldError from '../../../../common/FieldError';
import { withAuth } from '../../../../common/authValidation';
import { mergeLoaders } from '../../../../common/mergeLoaders';

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
    profile(obj) {
      return obj;
    }
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
