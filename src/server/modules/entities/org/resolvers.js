/*eslint-disable no-unused-vars*/
import { pick } from 'lodash';
import FieldError from '../../../../common/FieldError';
import { withAuth } from '../../../../common/authValidation';
import { mergeLoaders } from '../../../../common/mergeLoaders';

export default pubsub => ({
  Query: {
    orgs: withAuth(['org:view:all'], (obj, args, context) => {
      return context.Org.list(args);
    }),
    org: (obj, { id }, context) => {
      return context.Org.get(id);
    }
  },

  Org: {
    profile(obj) {
      return obj;
    },
    groups(obj, args, context) {
      return context.loaders.getGroupsForOrgId.load(obj.id);
    },
    users(obj, args, context) {
      return Promise.all([
        context.loaders.getUsersForOrgId.load(obj.id),
        context.loaders.getUsersForOrgIdViaGroups.load(obj.id)
      ]).then(mergeLoaders);
    }
    /*
    serviceaccounts(obj, args, context) {
      return Promise.all([
        context.loaders.getServiceAccountsForOrgId.load(obj.id),
        context.loaders.getServiceAccountsForOrgIdViaGroups.load(obj.id)
      ]).then(mergeLoaders);
    }
    */
  },

  OrgProfile: {
    domain(obj) {
      return obj.domain;
    },
    displayName(obj) {
      return obj.displayName;
    },
    description(obj) {
      return obj.description;
    }
  },

  Mutation: {
    addOrg: async (obj, { input }, context) => {
      try {
        const e = new FieldError();
        let org;

        return { org };
      } catch (e) {
        return { errors: e };
      }
    },
    editOrg: async (obj, { input }, context) => {
      try {
        const e = new FieldError();
        let org;

        return { org };
      } catch (e) {
        return { errors: e };
      }
    },
    deleteOrg: async (obj, { id }, context) => {
      try {
        const e = new FieldError();
        let org;

        return { org };
      } catch (e) {
        return { errors: e };
      }
    }
  },
  Subscription: {}
});
