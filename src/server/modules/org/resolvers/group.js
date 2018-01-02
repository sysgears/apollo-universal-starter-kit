/* eslint-disable no-unused-vars */
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
  if (!obj.Group) obj.Group = {};

  obj.Group.orgs = createBatchResolver(async (source, args, context) => {
    const gids = _.uniq(source.map(s => s.groupId));
    const groupOrgs = await context.Org.getOrgIdsForGroupIds({ ids: gids });

    const oids = _.uniq(_.map(_.flatten(groupOrgs), elem => elem.orgId));
    args.ids = oids;
    const orgs = await context.Org.getMany(args);

    let ret = reconcileBatchManyToMany(source, groupOrgs, orgs, 'groupId', 'orgId');
    return ret;
  });

  obj.Org.groups = createBatchResolver(async (source, args, context) => {
    const oids = _.uniq(source.map(s => s.orgId));
    const orgGroups = await context.Org.getGroupIdsForOrgIds({ ids: oids });

    const gids = _.uniq(_.map(_.flatten(orgGroups), elem => elem.groupId));
    args.ids = gids;
    const groups = await context.Group.getMany(args);

    let ret = reconcileBatchManyToMany(source, orgGroups, groups, 'orgId', 'groupId');
    return ret;
  });

  return obj;
}
