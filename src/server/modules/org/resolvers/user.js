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
  if (!obj.User) obj.User = {};

  obj.User.orgs = createBatchResolver(async (source, args, context) => {
    // console.log("RESOLVER - User.orgs - source", source)
    const uids = _.uniq(source.map(s => s.userId));
    // console.log("RESOLVER - User.orgs - uids", uids)
    const userOrgs = await context.Org.getOrgIdsForUserIdsViaGroups({ ids: uids });
    // console.log("RESOLVER - User.orgs - userOrgs", userOrgs)

    const oids = _.uniq(_.map(_.flatten(userOrgs), elem => elem.orgId));
    args.ids = oids;
    // console.log("RESOLVER - User.orgs - args", args)
    const orgs = await context.Org.getMany(args);
    // console.log("RESOLVER - User.orgs - orgs", orgs)

    let ret = reconcileBatchManyToMany(source, userOrgs, orgs, 'userId', 'orgId');
    // console.log("RESOLVER - User.orgs - ret", ret)
    return ret;
  });

  obj.Org.users = createBatchResolver(async (source, args, context) => {
    const oids = _.uniq(source.map(s => s.orgId));

    // TODO check that we probably need a call to getUserIdsForOrgIds
    // and then to marge the results before later processing
    // ... because a user could be in an org, but not in any groups
    const orgUsers = await context.Org.getUserIdsForOrgIdsViaGroups({ ids: oids });

    const uids = _.uniq(_.map(_.flatten(orgUsers), elem => elem.userId));
    args.ids = uids;
    const users = await context.User.getMany(args);

    let ret = reconcileBatchManyToMany(source, orgUsers, users, 'orgId', 'userId');
    return ret;
  });

  return obj;
}
