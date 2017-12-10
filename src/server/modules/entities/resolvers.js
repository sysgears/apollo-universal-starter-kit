/*eslint-disable no-unused-vars*/
import { pick } from 'lodash';
import FieldError from '../../../common/FieldError';

export default pubsub => ({
  Query: {
    orgs: (obj, args, context) => {
      return context.Org.list(args);
    },
    org: (obj, { id }, context) => {
      return context.Org.get(id);
    },

    groups: (obj, args, context) => {
      return context.Group.list(args);
    },
    group: (obj, { id }, context) => {
      return context.Group.get(id);
    },

    users: (obj, args, context) => {
      return context.User.list(args);
    },
    user: (obj, { id }, context) => {
      return context.User.get(id);
    },
    currentUser: (obj, args, context) => {
      if (context.user) {
        return context.User.get(context.user.id);
      } else {
        return null;
      }
    },

    serviceaccounts: (obj, args, context) => {
      return context.ServiceAccount.list(args);
    },
    serviceaccount: (obj, { id }, context) => {
      return context.ServiceAccount.get(id);
    }
  },

  Org: {
    profile(obj) {
      return obj;
    },
    groups(obj) {
      return obj;
    },
    users(obj) {
      return obj;
    },
    serviceaccounts(obj) {
      return obj;
    }
  },

  OrgProfile: {
    displayName(obj) {
      return obj.displayName;
    },
    description(obj) {
      return obj.description;
    }
  },

  Group: {
    profile(obj) {
      return obj;
    },
    orgs(obj) {
      return obj;
    },
    users(obj) {
      return obj;
    },
    serviceaccounts(obj) {
      return obj;
    }
  },

  GroupProfile: {
    displayName(obj) {
      return obj.displayName;
    },
    description(obj) {
      return obj.description;
    }
  },

  User: {
    profile(obj) {
      return obj;
    },
    /*
    auth(obj) {
      return obj;
    },
    */
    orgs(obj) {
      return obj;
    },
    groups(obj) {
      return obj;
    }
  },

  UserProfile: {
    displayName(obj) {
      return obj.displayName;
    },
    firstName(obj) {
      return obj.firstName;
    },
    lastName(obj) {
      return obj.lastName;
    },
    emails(obj) {
      return obj.emails;
    }
  },

  ServiceAccount: {
    profile(obj) {
      return obj;
    },
    /*
    auth(obj) {
      return obj;
    },
    */
    orgs(obj) {
      return obj;
    },
    groups(obj) {
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
    },

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
    },

    addUser: async (obj, { input }, context) => {
      try {
        const e = new FieldError();
        let user;

        return { user };
      } catch (e) {
        return { errors: e };
      }
    },
    editUser: async (obj, { input }, context) => {
      try {
        const e = new FieldError();
        let user;

        return { user };
      } catch (e) {
        return { errors: e };
      }
    },
    deleteUser: async (obj, { id }, context) => {
      try {
        const e = new FieldError();
        let user;

        return { user };
      } catch (e) {
        return { errors: e };
      }
    },

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
