/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import log from '../../../../common/log';

import FieldError from '../../../../common/FieldError';

import { authSwitch } from '../../../../common/auth/server';

import { reconcileBatchOneToOne, reconcileBatchManyToMany } from '../../../stores/sql/knex/helpers/batching';

export default function addResolvers(obj) {
  obj = addTypes(obj);
  return obj;
}

function addTypes(obj) {
  obj.User = {
    groups: createBatchResolver(async (source, args, context, info) => {
      console.log('User.groups', source, args);
      let path = info.path;
      let matchFilter = null;
      let resultFilter = null;
      let selectOverrides = null;
      let joins = [];
      let filters = [];
      let first = true;
      while (path) {
        if (path.key === 'orgs' || path.key === 'org') {
          let oids = _.uniq(source.map(s => s.orgId));

          joins.push({
            table: 'orgs_groups',
            join: 'left',
            args: ['orgs_groups.group_id', 'groups.id']
          });
          filters.push({
            bool: 'and',
            table: 'orgs_groups',
            field: 'org_id',
            compare: 'in',
            values: oids
          });

          selectOverrides = ['*'];

          resultFilter = 'orgId';
          break;
        }
        if (!first) {
          if (path.key === 'groups' || path.key === 'groups') {
            resultFilter = 'groupId';
            break;
          }
        } else {
          first = false;
        }
        path = path.prev;
      }

      const uids = _.uniq(source.map(s => s.userId));
      //console.log("RESOLVER - User.groups - uids", uids)
      const userGroups = await context.Group.getGroupIdsForUserIds({ ids: uids });
      console.log('RESOLVER - User.groups - userGroups', userGroups);

      const gids = _.uniq(_.map(_.flatten(userGroups), u => u.groupId));
      args.ids = gids;
      args.joins = args.joins ? args.joins.concat(joins) : joins;
      args.filters = args.filters ? args.filters.concat(filters.slice(1)) : filters;
      args.selectOverride = selectOverrides;
      args.printSQL = true;
      console.log('RESOLVER - User.groups - args', args, matchFilter, resultFilter);
      const groups = await context.Group.getMany(args);
      console.log('RESOLVER - User.groups - groups', groups);

      let ret = reconcileBatchManyToMany(source, userGroups, groups, 'userId', 'groupId', matchFilter, resultFilter);
      console.log('RESOLVER - User.groups - ret', ret);
      return ret;
    })
  };

  return obj;
}
