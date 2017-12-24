/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import log from '../../../common/log';

import FieldError from '../../../common/FieldError';
import { withAuth } from '../../../common/authValidation';
import { reconcileBatchOneToOne, reconcileBatchManyToMany } from '../../sql/helpers';

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
      // shortcut for other resolver paths which pull the profile with their call
      if (source[0].displayName) {
        return source;
      }

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
    addOrg: withAuth(
      (obj, args, context) => {
        return ['org/all/create', 'org/owner/create'];

        /*
        let s = context.org.id !== args.input.id ? ['org/all/create'] : ['org/owner/create'];
        console.log('addOrg', context.user.id, context.auth.scope, s, args);
        return s;
        */
      },
      async (obj, { input }, context) => {
        console.log('adding org:', input);
        try {
          const e = new FieldError();
          let oid = null;
          if (input.name) {
            const nameExists = await context.Org.getByName(input.name);
            if (nameExists) {
              e.setError('name', 'Name already exists.');
              e.throwIf();
            }
            oid = await context.Org.create({ name: input.name });
          } else {
            e.setError('name', 'Org name required.');
            e.throwIf();
          }

          if (!oid) {
            console.log('Error creating org', oid);
            e.setError('error', 'Something went wrong when creating the org');
            e.throwIf();
          }

          if (input.profile) {
            if (!input.profile.displayName) {
              input.profile.displayName = input.name;
            }
            console.log('creating org profile', input.profile);
            await context.Org.createProfile(oid, input.profile);
          }

          const org = await context.Org.get(oid);
          console.log('return org', org);
          return { org, errors: null };
        } catch (e) {
          return { org: null, errors: e };
        }
      }
    ),

    editOrg: withAuth(
      (obj, args, context) => {
        let s = context.org.id !== args.input.id ? ['org/all/update'] : ['org/owner/update'];
        console.log('editOrg', context.org.id, context.auth.scope, s, args);
        return s;
      },
      async (obj, { input }, context) => {
        try {
          const e = new FieldError();
          if (input.name) {
            console.log('updating org name');
            const nameExists = await context.Org.getByName(input.name);
            if (nameExists && nameExists.id !== input.id) {
              e.setError('name', 'E-mail already exists.');
              e.throwIf();
            }
            await context.Org.update(input.id, { name: input.name });
          }

          if (input.profile) {
            console.log('updating org profile', input.profile);
            await context.Org.updateProfile(input.id, input.profile);
          }

          const org = await context.Org.get(input.id);
          console.log('return org', org);
          return { org, errors: null };
        } catch (e) {
          return { org: null, errors: e };
        }
      }
    ),

    deleteOrg: withAuth(
      (obj, args, context) => {
        return context.org.id !== args.id ? ['org/all/delete'] : ['org/owner/delete'];
      },
      async (obj, { id }, context) => {
        try {
          const e = new FieldError();

          const org = await context.Org.get(id);
          if (!org) {
            e.setError('delete', 'Org does not exist.');
            e.throwIf();
          }

          const isDeleted = await context.Org.delete(id);
          if (isDeleted) {
            return { org, errors: null };
          } else {
            e.setError('delete', 'Could not delete org. Please try again later.');
            e.throwIf();
          }
        } catch (e) {
          return { org: null, errors: e };
        }
      }
    ),

    addUserToOrg: withAuth(
      (obj, args, context) => {
        return ['org.member/all/create', 'org.member/owner/create'];
      },
      async (obj, { orgId, userId }, context) => {
        try {
          const e = new FieldError();

          const org = await context.Org.get(orgId);
          if (!org) {
            e.setError('add', 'Org does not exist.');
            e.throwIf();
          }

          const user = await context.User.get(userId);
          if (!user) {
            e.setError('add', 'Org does not exist.');
            e.throwIf();
          }

          const isAdded = await context.Org.addUserToOrg(orgId, userId);
          if (isAdded) {
            return { org, errors: null };
          } else {
            e.setError('add', 'Could not add user to org. Please try again later.');
            e.throwIf();
          }
        } catch (e) {
          return { org: null, errors: e };
        }
      }
    ),

    removeUserFromOrg: withAuth(
      (obj, args, context) => {
        return ['org.member/all/delete', 'org.member/owner/delete'];
      },
      async (obj, { orgId, userId }, context) => {
        try {
          const e = new FieldError();

          const org = await context.Org.get(orgId);
          if (!org) {
            e.setError('remove', 'Org does not exist.');
            e.throwIf();
          }

          const user = await context.User.get(userId);
          if (!user) {
            e.setError('remove', 'Org does not exist.');
            e.throwIf();
          }

          const isRemoved = await context.Org.removeUserFromOrg(orgId, userId);
          if (isRemoved) {
            return { org, errors: null };
          } else {
            log.error('Error removing user');
            e.setError('remove', 'Could not remove user from org. Please try again later.');
            e.throwIf();
          }
        } catch (e) {
          return { org: null, errors: e };
        }
      }
    ),

    addGroupToOrg: withAuth(
      (obj, args, context) => {
        return ['org.member/all/create', 'org.member/owner/create'];
      },
      async (obj, { orgId, groupId }, context) => {
        try {
          const e = new FieldError();

          const org = await context.Org.get(orgId);
          if (!org) {
            e.setError('add', 'Org does not exist.');
            e.throwIf();
          }

          const group = await context.Group.get(groupId);
          if (!group) {
            e.setError('add', 'Org does not exist.');
            e.throwIf();
          }

          const isAdded = await context.Org.addGroupToOrg(orgId, groupId);
          if (isAdded) {
            return { org, errors: null };
          } else {
            e.setError('add', 'Could not add group to org. Please try again later.');
            e.throwIf();
          }
        } catch (e) {
          return { org: null, errors: e };
        }
      }
    ),

    removeGroupFromOrg: withAuth(
      (obj, args, context) => {
        return ['org.member/all/delete', 'org.member/owner/delete'];
      },
      async (obj, { orgId, groupId }, context) => {
        try {
          const e = new FieldError();

          const org = await context.Org.get(orgId);
          if (!org) {
            e.setError('remove', 'Org does not exist.');
            e.throwIf();
          }

          const group = await context.Group.get(groupId);
          if (!group) {
            e.setError('remove', 'Org does not exist.');
            e.throwIf();
          }

          const isRemoved = await context.Org.removeGroupFromOrg(orgId, groupId);
          if (isRemoved) {
            return { org, errors: null };
          } else {
            log.error('Error removing group');
            e.setError('remove', 'Could not remove group from org. Please try again later.');
            e.throwIf();
          }
        } catch (e) {
          return { org: null, errors: e };
        }
      }
    )
  },

  Subscription: {}
});
