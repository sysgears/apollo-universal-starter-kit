/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import FieldError from '../../../../common/FieldError';
import { withAuth } from '../../../../common/authValidation';
import { mergeLoaders } from '../../../../common/mergeLoaders';

export default pubsub => ({
  Query: {
    orgs: withAuth(['org/all/list'], (obj, args, context) => {
      return context.Org.list(args);
    }),
    myOrgs: async (obj, args, context) => {
      try {
        args.memberId = context.user.id;
        let ret = await context.Org.list(args);
        return { orgs: ret, errors: null };
      } catch (e) {
        return { orgs: null, errors: e };
      }
    },
    org: (obj, { id }, context) => {
      return context.Org.get(id);
    }
  },

  User: {
    orgs: createBatchResolver(async (source, args, context) => {
      // unique the incoming ids, graphql-resolve-batch is giving dpulicates, see Part-II
      const uids = _.uniq(source.map(s => s.userId));
      // console.log("RESOLVER - User.orgs - uids", uids, source)

      const userOrgs = await context.Org.getOrgIdsForUserIdsViaGroups(uids);
      // console.log("RESOLVER - User.orgs - userOrgs", userOrgs)

      const oids = _.uniq(_.map(_.flatten(userOrgs), el => el.orgId));
      // console.log("RESOLVER - User.orgs - oids", oids)

      const orgs = await context.Org.getMany(oids);
      // console.log("RESOLVER - User.orgs - orgs", orgs)

      let ret = [];
      for (let s of source) {
        let user = _.find(userOrgs, u => u.length > 0 && u[0].userId === s.userId);
        let os = _.uniqBy(user, 'orgId');
        let ov = _.intersectionWith(orgs, os, (lhs, rhs) => lhs.orgId === rhs.orgId);
        if (ov) {
          ret.push(ov);
        } else {
          ret.push([]);
        }
      }

      // console.log("RESOLVER - User.orgs - ret", ret)
      return ret;
    })
  },

  Group: {
    orgs: createBatchResolver(async (source, args, context) => {
      // unique the incoming ids, graphql-resolve-batch is giving dpulicates, see Part-II
      const gids = _.uniq(source.map(s => s.groupId));
      // console.log("RESOLVER - Group.orgs - uids", uids, source)

      const groupOrgs = await context.Org.getOrgIdsForGroupIds(gids);
      // console.log("RESOLVER - Group.orgs - userOrgs", userOrgs)

      const oids = _.uniq(_.map(_.flatten(groupOrgs), el => el.orgId));
      // console.log("RESOLVER - Group.orgs - oids", oids)

      const orgs = await context.Org.getMany(oids);
      // console.log("RESOLVER - Org.users - orgs", orgs)

      let ret = [];
      for (let s of source) {
        let group = _.find(groupOrgs, u => u.length > 0 && u[0].groupId === s.groupId);
        let os = _.uniqBy(group, 'orgId');
        let ov = _.intersectionWith(orgs, os, (lhs, rhs) => lhs.orgId === rhs.orgId);
        if (ov) {
          ret.push(ov);
        } else {
          ret.push([]);
        }
      }

      // console.log("RESOLVER - Group.orgs - ret", ret)
      return ret;
    })
  },

  Org: {
    id(obj) {
      return obj.orgId;
    },
    profile: createBatchResolver(async (source, args, context) => {
      let oids = _.uniq(source.map(s => s.orgId));
      const profiles = await context.Org.getProfileMany(oids);

      if (source.length === profiles.length) {
        return profiles;
      }

      // graphql-resolve-batch Part-II, fill in sources with 'null' which had no results
      let ret = [];
      for (let s of source) {
        const res = profiles.find(elem => elem.orgId === s.orgId);
        if (res) {
          ret.push(res);
        } else {
          ret.push(null);
        }
      }
      return ret;
    }),

    groups: createBatchResolver(async (source, args, context) => {
      const oids = _.uniq(source.map(s => s.orgId));
      // console.log("RESOLVER - Org.groups - oids", oids, source)

      const orgGroups = await context.Org.getGroupIdsForOrgIds(oids);
      // console.log("RESOLVER - Org.groups - orgGroups", orgGroups)

      const uids = _.uniq(_.map(_.flatten(orgGroups), u => u.groupId));
      // console.log("RESOLVER - Org.groups - uids", uids)

      const groups = await context.Group.getMany(uids);
      // console.log("RESOLVER - Org.groups - groups", groups)

      // graphql-resolve-batch Part-II
      // need to return the same number of elements as input,
      // but the lookup function returns per unique group id with array of orgs under it
      let ret = [];
      for (let s of source) {
        let org = _.find(orgGroups, o => o.length > 0 && o[0].orgId === s.orgId);
        let us = _.uniqBy(org, 'groupId');
        let uv = _.intersectionWith(groups, us, (lhs, rhs) => lhs.groupId === rhs.groupId);
        if (uv) {
          ret.push(uv);
        } else {
          ret.push([]);
        }
      }

      // console.log("RESOLVER - Org.groups - ret", ret)
      return ret;
    }),

    users: createBatchResolver(async (source, args, context) => {
      // unique the incoming ids, graphql-resolve-batch is giving dpulicates, see Part-II
      const oids = _.uniq(source.map(s => s.orgId));
      // console.log("RESOLVER - Org.users - oids", oids, source)

      const orgUsers = await context.Org.getUserIdsForOrgIdsViaGroups(oids);
      // console.log("RESOLVER - Org.users - orgUsers", orgUsers)

      const uids = _.uniq(_.map(_.flatten(orgUsers), u => u.userId));
      // console.log("RESOLVER - Org.users - uids", uids)

      const users = await context.User.getMany(uids);
      // console.log("RESOLVER - Org.users - users", users)

      // graphql-resolve-batch Part-II
      // need to return the same number of elements as input,
      // but the lookup function returns per unique group id with array of orgs under it
      let ret = [];
      for (let s of source) {
        let org = _.find(orgUsers, o => o.length > 0 && o[0].orgId === s.orgId);
        let us = _.uniqBy(org, 'userId');
        let uv = _.intersectionWith(users, us, (lhs, rhs) => lhs.userId === rhs.userId);
        if (uv) {
          ret.push(uv);
        } else {
          ret.push([]);
        }
      }

      // console.log("RESOLVER - Org.users - ret", ret)
      return ret;
    })

    /*
    serviceaccounts(obj, args, context) {
      return Promise.all([
        context.loaders.getServiceAccountsForOrgId.load(obj.id),
        context.loaders.getServiceAccountsForOrgIdViaGroups.load(obj.id)
      ]).then(mergeLoaders);
    }
    */
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
