/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import log from '../../../common/log';

import FieldError from '../../../common/FieldError';
import { withAuth } from '../../../common/authValidation';
import { reconcileBatchOneToOne, reconcileBatchManyToMany } from '../../stores/sql/knex/helpers/batching';

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
      const groupUsers = await context.Group.getUserIdsForGroupIds({ ids: [args.id] });

      const uids = _.uniq(_.map(_.flatten(groupUsers), u => u.userId));
      args.ids = uids;
      const users = await context.User.getMany(args);
      return users;
    }
  },

  User: {
    groups: createBatchResolver(async (source, args, context) => {
      const uids = _.uniq(source.map(s => s.userId));
      //console.log("RESOLVER - User.groups - uids", uids)
      const userGroups = await context.Group.getGroupIdsForUserIds({ ids: uids });
      //console.log("RESOLVER - User.groups - userGroups", userGroups)

      const gids = _.uniq(_.map(_.flatten(userGroups), u => u.groupId));
      args.ids = gids;
      //console.log("RESOLVER - User.groups - args", args)
      const groups = await context.Group.getMany(args);
      //console.log("RESOLVER - User.groups - groups", groups)

      let ret = reconcileBatchManyToMany(source, userGroups, groups, 'userId', 'groupId');
      //console.log("RESOLVER - User.groups - ret", ret)
      return ret;
    })
  },

  Group: {
    id(obj) {
      return obj.groupId ? obj.groupId : obj.id;
    },
    profile: createBatchResolver(async (source, args, context) => {
      // shortcut for other resolver paths which pull the profile with their call
      if (source[0].displayName) {
        return source;
      }

      let ids = _.uniq(source.map(s => s.groupId));
      args.ids = ids;
      const profiles = await context.Group.getProfileMany(args);
      const ret = reconcileBatchOneToOne(source, profiles, 'groupId');
      return ret;
    }),
    users: createBatchResolver(async (source, args, context) => {
      //console.log("RESOLVER - Group.users - source", source)
      const gids = _.uniq(source.map(s => s.groupId));
      //console.log("RESOLVER - Group.users - gids", gids)
      const groupUsers = await context.Group.getUserIdsForGroupIds({ ids: gids });
      //console.log("RESOLVER - Group.users - groupUsers", groupUsers)

      const uids = _.uniq(_.map(_.flatten(groupUsers), u => u.userId));
      args.ids = uids;
      //console.log("RESOLVER - Group.users - args", args)
      const users = await context.User.getMany(args);
      //console.log("RESOLVER - Group.users - users", users)

      let ret = reconcileBatchManyToMany(source, groupUsers, users, 'groupId', 'userId');
      //console.log("RESOLVER - Group.users - ret", ret)
      return ret;
    })
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
    addGroup: withAuth(
      (obj, args, context) => {
        return ['group/all/create', 'group/owner/create'];

        /*
        let s = context.group.id !== args.input.id ? ['group/all/create'] : ['group/owner/create'];
        console.log('addGroup', context.user.id, context.auth.scope, s, args);
        return s;
        */
      },
      async (obj, { input }, context) => {
        console.log('adding group:', input);
        try {
          const e = new FieldError();
          let gid = null;
          if (input.name) {
            const nameExists = await context.Group.getByName(input.name);
            if (nameExists) {
              e.setError('name', 'Name already exists.');
              e.throwIf();
            }
            gid = await context.Group.create({ name: input.name });
          } else {
            e.setError('name', 'Group name required.');
            e.throwIf();
          }

          if (!gid) {
            console.log('Error creating group', gid);
            e.setError('error', 'Something went wrong when creating the group');
            e.throwIf();
          }

          if (input.profile) {
            if (!input.profile.displayName) {
              input.profile.displayName = input.name;
            }
            console.log('creating group profile', input.profile);
            await context.Group.createProfile(gid, input.profile);
          }

          const group = await context.Group.get(gid);
          console.log('return group', group);
          return { group, errors: null };
        } catch (e) {
          return { group: null, errors: e };
        }
      }
    ),
    editGroup: withAuth(
      (obj, args, context) => {
        let s = context.group.id !== args.input.id ? ['group/all/update'] : ['group/owner/update'];
        console.log('editGroup', context.group.id, context.auth.scope, s, args);
        return s;
      },
      async (obj, { input }, context) => {
        try {
          const e = new FieldError();
          if (input.name) {
            console.log('updating group name');
            const nameExists = await context.Group.getByName(input.name);
            if (nameExists && nameExists.id !== input.id) {
              e.setError('name', 'E-mail already exists.');
              e.throwIf();
            }
            await context.Group.update(input.id, { name: input.name });
          }

          if (input.profile) {
            console.log('updating group profile', input.profile);
            await context.Group.updateProfile(input.id, input.profile);
          }

          const group = await context.Group.get(input.id);
          console.log('return group', group);
          return { group, errors: null };
        } catch (e) {
          return { group: null, errors: e };
        }
      }
    ),
    deleteGroup: withAuth(
      (obj, args, context) => {
        return context.group.id !== args.id ? ['group/all/delete'] : ['group/owner/delete'];
      },
      async (obj, { id }, context) => {
        try {
          const e = new FieldError();

          const group = await context.Group.get(id);
          if (!group) {
            e.setError('delete', 'Group does not exist.');
            e.throwIf();
          }

          const isDeleted = await context.Group.delete(id);
          if (isDeleted) {
            return { group, errors: null };
          } else {
            e.setError('delete', 'Could not delete group. Please try again later.');
            e.throwIf();
          }
        } catch (e) {
          return { group: null, errors: e };
        }
      }
    ),

    addUserToGroup: withAuth(
      (obj, args, context) => {
        return ['group.member/all/create', 'group.member/owner/create'];
      },
      async (obj, { groupId, userId }, context) => {
        try {
          const e = new FieldError();

          const group = await context.Group.get(groupId);
          if (!group) {
            e.setError('add', 'Group does not exist.');
            e.throwIf();
          }

          const user = await context.User.get(userId);
          if (!user) {
            e.setError('add', 'Group does not exist.');
            e.throwIf();
          }

          const isAdded = await context.Group.addUserToGroup(userId, groupId);
          if (isAdded) {
            return { group, errors: null };
          } else {
            e.setError('add', 'Could not add user to group. Please try again later.');
            e.throwIf();
          }
        } catch (e) {
          return { group: null, errors: e };
        }
      }
    ),

    removeUserFromGroup: withAuth(
      (obj, args, context) => {
        return ['group.member/all/delete', 'group.member/owner/delete'];
      },
      async (obj, { groupId, userId }, context) => {
        try {
          const e = new FieldError();

          const group = await context.Group.get(groupId);
          if (!group) {
            e.setError('remove', 'Group does not exist.');
            e.throwIf();
          }

          const user = await context.User.get(userId);
          if (!user) {
            e.setError('remove', 'Group does not exist.');
            e.throwIf();
          }

          const isRemoved = await context.Group.removeUserFromGroup(userId, groupId);
          if (isRemoved) {
            return { user, group, errors: null };
          } else {
            log.error('Error removing user', isRemoved);
            e.setError('remove', 'Could not remove user from group. Please try again later.');
            e.throwIf();
          }
        } catch (e) {
          return { user: null, group: null, errors: e };
        }
      }
    )
  },

  Subscription: {}
});
