/*eslint-disable no-unused-vars*/
import { _, pick } from 'lodash';
import FieldError from '../../../../common/FieldError';
import { withAuth } from '../../../../common/authValidation';
import { mergeLoaders } from '../../../../common/mergeLoaders';

export default pubsub => ({
  Query: {
    groups: withAuth(['group/all/list'], async (obj, args, context) => {
      console.log('groups:', args);
      let ret = await context.Group.list(args);
      console.log('groups:', ret);
      return ret;
    }),
    myGroups: async (obj, args, context) => {
      try {
        args.memberId = context.user.id;
        let ret = await context.Group.list(args);
        return { groups: ret, errors: null };
      } catch (e) {
        return { groups: null, errors: e };
      }
    },
    group: withAuth(
      (obj, args, context) => {
        return context.user.id !== args.id ? ['group/all/view'] : ['group/member/view'];
      },
      (obj, args, context) => {
        let { id } = args;
        return context.Group.get(id);
      }
    )
  },

  User: {
    groups: async (obj, args, context) => {
      return context.loaders.getGroupsForUserIds.load(context.user.id);
    }
  },

  Group: {
    role(obj) {
      return 'none';
    },
    profile(obj) {
      return obj;
    },
    users: async (obj, args, context) => {
      let guids = await context.loaders.getUsersForGroupIds.load(obj.id);
      let uids = _.map(guids, e => e.userId);
      let ret = await context.loaders.getBriefForUserIds.loadMany(uids);
      return ret;
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

  Mutation: {
    addGroup: async (obj, { input }, context) => {
      try {
        const e = new FieldError();
        let group;

        return { group, errors: null };
      } catch (e) {
        return { group: null, errors: e };
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
