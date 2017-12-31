/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import { authSwitch } from '../../../../common/auth/server';
import FieldError from '../../../../common/FieldError';

import { reconcileBatchOneToOne, reconcileBatchManyToMany } from '../../../stores/sql/knex/helpers/batching';

import log from '../../../../common/log';

export default function addResolvers(obj) {
  obj = addTypes(obj);
  return obj;
}

function addTypes(obj) {
  obj.Group = {
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

    users: authSwitch([
      {
        // Someone who can view all groups, likely an admin
        requiredScopes: ['group:members/superuser/list', 'group:members/admin/list'],
        callback: createBatchResolver(async (source, args, context, info) => {
          const gids = _.uniq(source.map(s => s.groupId));
          const groupUsers = await context.Group.getUserIdsForGroupIds({ ids: gids });

          const uids = _.uniq(_.map(_.flatten(groupUsers), u => u.userId));
          args.ids = uids;
          const users = await context.User.getMany(args);

          let ret = reconcileBatchManyToMany(source, groupUsers, users, 'groupId', 'userId');
          /*
          for (let i in ret) {
            console.log("Group.users", i)
            console.log(source[i])
            console.log(ret[i])
            console.log()
          }
          */
          return ret;
        })
      },
      {
        // Someone who has permissions on this group
        requiredScopes: ['group:members/owner/list', 'group:members/member/list'],
        callback: createBatchResolver(async (source, args, context, info) => {
          // Need to filter source Ids here, by the requesting party and context

          const gids = _.uniq(source.map(s => s.groupId));
          const groupUsers = await context.Group.getUserIdsForGroupIds({ ids: gids });

          const uids = _.uniq(_.map(_.flatten(groupUsers), u => u.userId));
          args.ids = uids;
          const users = await context.User.getMany(args);

          let ret = reconcileBatchManyToMany(source, groupUsers, users, 'groupId', 'userId');
          return ret;
        })
      }
    ])
  };

  obj.GroupProfile = {
    displayName(obj) {
      return obj.displayName;
    },
    description(obj) {
      return obj.description;
    }
  };

  return obj;
}
