/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import FieldError from '../../../../common/FieldError';
import { withAuth } from '../../../../common/authValidation';
import { mergeLoaders } from '../../../../common/mergeLoaders';

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
      console.log('RESOLVER - Users.group - input', source, args);

      // unique the incoming ids, graphql-resolve-batch is giving dpulicates, see Part-II
      const uids = _.uniq(source.map(s => s.userId));
      // console.log("RESOLVER - Users.group - gids", gids)

      const userGroups = await context.Group.getGroupIdsForUserIds(uids);
      // console.log("RESOLVER - Users.group - userGroups", userGroups)

      const gids = _.uniq(_.map(_.flatten(userGroups), u => u.groupId));
      console.log('RESOLVER - Users.group - gids', gids);

      const groups = await context.Group.getMany(gids);
      console.log('RESOLVER - Users.group - groups', groups);

      // graphql-resolve-batch Part-II
      // need to return the same number of elements as input,
      // but the lookup function returns per unique user id with array of orgs under it
      let ret = [];
      for (let s of source) {
        let user = _.find(userGroups, o => o.length > 0 && o[0].userId === s.userId);
        let us = _.uniqBy(user, 'groupId');
        let uv = _.intersectionWith(groups, us, (lhs, rhs) => lhs.groupId === rhs.groupId);
        if (uv) {
          ret.push(uv);
        } else {
          ret.push([]);
        }
      }

      // console.log("RESOLVER - User.groups - ret", ret)
      return ret;
    })
  },

  Group: {
    id(obj) {
      return obj.groupId;
    },
    profile: createBatchResolver(async (source, args, context) => {
      // unique the incoming ids, graphql-resolve-batch is giving dpulicates, see Part-II
      let gids = _.uniq(source.map(s => s.groupId));
      const profiles = await context.Group.getProfileMany(gids);

      if (source.length === profiles.length) {
        return profiles;
      }

      // graphql-resolve-batch Part-II
      let ret = [];
      for (let s of source) {
        const res = profiles.find(elem => elem.groupId === s.groupId);
        if (res) {
          ret.push(res);
        } else {
          ret.push(null);
        }
      }
      return ret;
    }),
    users: createBatchResolver(async (source, args, context) => {
      console.log('RESOLVER - Group.users - input', source, args);

      // unique the incoming ids, graphql-resolve-batch is giving dpulicates, see Part-II
      const gids = _.uniq(source.map(s => s.groupId));
      // console.log("RESOLVER - Group.users - gids", gids)

      const groupUsers = await context.Group.getUserIdsForGroupIds(gids);
      // console.log("RESOLVER - Group.users - groupUsers", groupUsers)

      const uids = _.uniq(_.map(_.flatten(groupUsers), u => u.userId));
      console.log('RESOLVER - Group.users - uids', uids);

      const users = await context.User.getMany(uids);
      console.log('RESOLVER - Group.users - users', users);

      // graphql-resolve-batch Part-II
      // need to return the same number of elements as input,
      // but the lookup function returns per unique group id with array of orgs under it
      let ret = [];
      for (let s of source) {
        let org = _.find(groupUsers, o => o.length > 0 && o[0].groupId === s.groupId);
        let us = _.uniqBy(org, 'userId');
        let uv = _.intersectionWith(users, us, (lhs, rhs) => lhs.userId === rhs.userId);
        if (uv) {
          ret.push(uv);
        } else {
          ret.push([]);
        }
      }

      // console.log("RESOLVER - Group.users - ret", ret)
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
