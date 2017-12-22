/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import FieldError from '../../../../common/FieldError';
import { withAuth } from '../../../../common/authValidation';
import { reconcileBatchOneToOne, reconcileBatchManyToMany } from '../../../sql/helpers';

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
      const uids = _.uniq(source.map(s => s.userId));

      // TODO check that we probably need a call to getUserIdsForOrgIds
      // and then to marge the results before later processing
      // ... because a user could be in an org, but not in any groups
      const userOrgs = await context.Org.getOrgIdsForUserIdsViaGroups(uids);

      const oids = _.uniq(_.map(_.flatten(userOrgs), elem => elem.orgId));
      const orgs = await context.Org.getMany(oids);

      let ret = reconcileBatchManyToMany(source, userOrgs, orgs, 'userId', 'orgId');
      return ret;
    })
  },

  Group: {
    orgs: createBatchResolver(async (source, args, context) => {
      const gids = _.uniq(source.map(s => s.groupId));
      const groupOrgs = await context.Org.getOrgIdsForGroupIds(gids);

      const oids = _.uniq(_.map(_.flatten(groupOrgs), elem => elem.orgId));
      const orgs = await context.Org.getMany(oids);

      let ret = reconcileBatchManyToMany(source, groupOrgs, orgs, 'groupId', 'orgId');
      return ret;
    })
  },

  Org: {
    id(obj) {
      return obj.orgId;
    },
    profile: createBatchResolver(async (source, args, context) => {
      let ids = _.uniq(source.map(s => s.orgId));
      const profiles = await context.Org.getProfileMany(ids);
      const ret = reconcileBatchOneToOne(source, profiles, 'orgId');
      return ret;
    }),

    groups: createBatchResolver(async (source, args, context) => {
      const oids = _.uniq(source.map(s => s.orgId));
      const orgGroups = await context.Org.getGroupIdsForOrgIds(oids);

      const gids = _.uniq(_.map(_.flatten(orgGroups), elem => elem.groupId));
      const groups = await context.Group.getMany(gids);

      let ret = reconcileBatchManyToMany(source, orgGroups, groups, 'orgId', 'groupId');
      return ret;
    }),

    users: createBatchResolver(async (source, args, context) => {
      const oids = _.uniq(source.map(s => s.orgId));

      // TODO check that we probably need a call to getUserIdsForOrgIds
      // and then to marge the results before later processing
      // ... because a user could be in an org, but not in any groups
      const orgUsers = await context.Org.getUserIdsForOrgIdsViaGroups(oids);

      const uids = _.uniq(_.map(_.flatten(orgUsers), elem => elem.userId));
      const users = await context.User.getMany(uids);

      let ret = reconcileBatchManyToMany(source, orgUsers, users, 'orgId', 'userId');
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
