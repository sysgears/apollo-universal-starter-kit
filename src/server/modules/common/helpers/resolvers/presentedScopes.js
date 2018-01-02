import _ from 'lodash';

import { reconcileBatchOneToMany } from './batching';
import { pathExtractor } from './path';

export function userPresentedScopes(options) {
  if (!options) options = {};
  let opts = {
    idExtractor: options.idExtractor
  };

  return (obj, args, context, info) => {
    return opts.idExtractor ? opts.idExtractor(obj, args, context, info) : context.auth.userScopes;
  };
}

export function groupPresentedScopes(options) {
  if (!options) options = {};
  let opts = {
    idExtractor: options.idExtractor
      ? options.idExtractor
      : (_, args) => {
          return args.input ? args.input.id : args.id;
        }
  };

  return (obj, args, context, info) => {
    const groupId = opts.idExtractor(obj, args, context, info);
    console.log('Group Scopes - input', groupId, pathExtractor(info));

    let group = context.auth.groupRolesAndPermissions.filter(elem => groupId == elem.groupId);
    if (group) {
      console.log('Group Scopes - group', group);
      const scopes = group.permissions.map(e => e.name);
      return scopes;
    }
    // if not in group, fallback to user scopes, what about group scopes?
    return context.auth.userScopes;
  };
}

export function groupsPresentedScopes(options) {
  if (!options) options = {};
  let opts = {
    idExtractor: options.idExtractor
      ? options.idExtractor
      : (sources, args) => {
          return sources && sources.length
            ? sources.map(e => e.groupId || e.id)
            : args.input ? args.input.ids : args.ids;
        }
  };

  return (sources, args, context, info) => {
    const groupIds = opts.idExtractor(sources, args, context, info);
    // console.log("GroupS Scopes - input", groupIds, pathExtractor(info))
    let groups = context.auth.groupRolesAndPermissions.filter(elem => groupIds.includes(elem.groupId));
    // console.log("GroupS Scopes - groups", groups)
    // console.log("GroupS Scopes - roles", groups[0].roles[0])
    let scopes = groups.map(group => _.flatten(group.roles.map(role => role.permissions)));
    // console.log("GroupS Scopes - scopes", scopes)
    if (scopes) {
      let ret = reconcileBatchOneToMany(sources, scopes, 'groupId');
      for (let r in ret) {
        ret[r] = ret[r].map(perm => perm.name);
      }
      // console.log("GroupS Scopes - ret", ret)
      return ret;
    }
    // if not in group, fallback to user scopes, what about group scopes?
    return context.auth.userScopes;
  };
}

/*
export function orgPresentedScopes(options) {
  if (!options) options = {};
  let opts = {
    idExtractor: options.idExtractor
      ? options.idExtractor(obj, args, context, info)
      : (_, args) => {
          return args.input ? args.input.id : args.id;
        }
  };

  return (obj, args, context, info) => {
    const orgId = opts.idExtractor(sources, args, context, info);
    let orgs = context.auth.orgRolesAndPermissions.filter(elem => orgId.includes(elem.orgId));
    if (orgs) {
      let scopes = reconcileBatchOneToOne(orgId, orgs);
      return scopes;
    }
    // if not in org, fallback to user scopes, what about group scopes?
    return context.auth.userScopes;
  };
}

export function orgsPresentedScopes(options) {
  if (!options) options = {};
  let opts = {
    idExtractor: options.idExtractor
      ? options.idExtractor
      : (_, args) => {
          return args.input ? args.input.ids : args.ids;
        }
  };

  return (obj, args, context, info) => {
    const orgIds = opts.idExtractor(sources, args, context, info);
    let orgs = context.auth.orgRolesAndPermissions.filter(elem => orgIds.includes(elem.orgId));
    if (orgs) {
      let scopes = reconcileBatchOneToOne(orgIds, orgs);
      return scopes;
    }
    // if not in org, fallback to user scopes, what about group scopes?
    return context.auth.userScopes;
  };
}
*/
