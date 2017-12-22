/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import FieldError from '../../../../common/FieldError';
import { withAuth } from '../../../../common/authValidation';
import { reconcileBatchOneToOne, reconcileBatchManyToMany } from '../../../sql/helpers';

export default pubsub => ({
  Query: {
    groups: withAuth(['group/all/list'], async (obj, args, context) => {
      let ret = await context.Group.list(args);
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
    ),

    groupMembers: async (obj, args, context) => {
      // console.log("GROUP MEMBERS - args", args)
      let users = await context.loaders.getUserIdsForGroupIds.load(args.id);
      let uids = _.map(users, e => e.userId);
      let briefs = await context.loaders.getBriefForUserIds.loadMany(uids);
      return briefs;
    }
  },

  User: {
    groups: createBatchResolver(async (source, args, context) => {
      const uids = _.uniq(source.map(s => s.userId));
      const userGroups = await context.Group.getGroupIdsForUserIds(uids);

      const gids = _.uniq(_.map(_.flatten(userGroups), u => u.groupId));
      const groups = await context.Group.getMany(gids);

      let ret = reconcileBatchManyToMany(source, userGroups, groups, 'userId', 'groupId');
      return ret;
    })
  },

  Group: {
    id(obj) {
      return obj.groupId;
    },
    profile: createBatchResolver(async (source, args, context) => {
      let ids = _.uniq(source.map(s => s.groupId));
      const profiles = await context.Group.getProfileMany(ids);
      const ret = reconcileBatchOneToOne(source, profiles, 'groupId');
      return ret;
    }),
    users: createBatchResolver(async (source, args, context) => {
      const gids = _.uniq(source.map(s => s.groupId));
      const groupUsers = await context.Group.getUserIdsForGroupIds(gids);

      const uids = _.uniq(_.map(_.flatten(groupUsers), u => u.userId));
      const users = await context.User.getMany(uids);

      let ret = reconcileBatchManyToMany(source, groupUsers, users, 'groupId', 'userId');
      return ret;
    })
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
