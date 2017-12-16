/*eslint-disable no-unused-vars*/
import { pick } from 'lodash';
import FieldError from '../../../../common/FieldError';
import { withAuth } from '../../../../common/authValidation';
import { mergeLoaders } from '../../../../common/mergeLoaders';

export default pubsub => ({
  Query: {
    groups: (obj, args, context) => {
      return context.Group.list(args);
    },
    group: (obj, { id }, context) => {
      return context.Group.get(id);
    }
  },

  Group: {
    profile(obj) {
      return obj;
    },
    users(obj, args, context) {
      return context.loaders.getUsersForGroupId.load(obj.id);
    }
    /*
    orgs(obj, args, context) {
      return context.loaders.getOrgsForGroupId.load(obj.id);
    },
    serviceaccounts(obj, args, context) {
      return context.loaders.getServiceAccountsForGroupId.load(obj.id);
    }
    */
  },

  GroupProfile: {
    displayName(obj) {
      return obj.displayName;
    },
    description(obj) {
      return obj.description;
    }
  },

  Mutation: {
    addGroup: async (obj, { input }, context) => {
      try {
        const e = new FieldError();
        let group;

        return { group };
      } catch (e) {
        return { errors: e };
      }
    },
    editGroup: async (obj, { input }, context) => {
      try {
        const e = new FieldError();
        let group;

        return { group };
      } catch (e) {
        return { errors: e };
      }
    },
    deleteGroup: async (obj, { id }, context) => {
      try {
        const e = new FieldError();
        let group;

        return { group };
      } catch (e) {
        return { errors: e };
      }
    }
  },
  Subscription: {}
});
