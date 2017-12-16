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
    },
    auth(obj) {
      return obj;
    },
    orgs(obj, args, context) {
      return Promise.all([
        context.loaders.getOrgsForServiceAccountId.load(obj.id),
        context.loaders.getOrgsForServiceAccountIdViaGroups.load(obj.id)
      ]).then(mergeLoaders);
    },
    groups(obj, args, context) {
      return context.loaders.getGroupsForServiceAccountId.load(obj.id);
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
