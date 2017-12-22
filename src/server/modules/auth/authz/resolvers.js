/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import { withAuth } from '../../../../common/authValidation';

import settings from '../../../../../settings';

const entities = settings.entities;

let obj = {
  Query: {},

  RoleInfo: {
    id(obj) {
      return obj.roleId ? obj.roleId : obj.id ? obj.id : null;
    },
    name(obj) {
      console.log('RoleInfo.name', obj);
      return obj.name ? obj.name : obj.roleName ? obj.roleName : null;
    },
    displayName(obj) {
      return obj.displayName ? obj.displayName : null;
    },
    description(obj) {
      return obj.description ? obj.description : null;
    },
    scopes(obj) {
      return obj.scopes ? obj.scopes : null;
    }
  },

  Mutation: {},
  Subscription: {}
};

if (entities.users.enabled === true) {
  obj.User = {
    userRoles: createBatchResolver(async (source, args, context) => {
      console.log('User.userRoles', source, args);

      const uids = _.uniq(source.map(s => s.userId));
      console.log('RESOLVER - User.userRoles - uids', uids);

      const ret = await context.Authz.getUserRolesForUser(obj.id);
      console.log('User.userRoles', ret);
      return ret;
    })
  };

  obj.UserRoleInfo = {
    id(obj) {
      return obj.roleId ? obj.roleId : obj.id ? obj.id : null;
    },
    name(obj) {
      return obj.roleName ? obj.roleName : obj.name ? obj.name : null;
    },
    scopes(obj) {
      return obj.scopes ? obj.scopes : null;
    }
  };
}

if (entities.groups.enabled === true) {
  obj.User.groupRoles = async (obj, args, context) => {
    console.log('User.groupRoles', obj, args);
    const ret = await context.Authz.getGroupRolesForUser(obj.id);
    console.log('User.groupRoles', ret, ret[0].roles);
    return ret;
  };

  obj.Group = {
    roles(obj, args, context) {
      console.log('Group.roles - resolver', args);
      return context.loaders.getRolesForGroups.load(obj.id);
    }
  };

  obj.GroupRoleInfo = {
    groupId(obj) {
      return obj.groupId ? obj.groupId : obj.id ? obj.id : null;
    },
    groupName(obj) {
      return obj.groupName ? obj.groupName : obj.name ? obj.name : null;
    },
    scopes(obj) {
      return obj.scopes ? obj.scopes : null;
    },
    roles(obj) {
      return obj.roles ? obj.roles : null;
    }
  };
}

if (entities.orgs.enabled === true) {
  obj.User.orgRoles = async (obj, args, context) => {
    // console.log("User.orgRoles", obj, args)
    const ret = await context.Authz.getOrgRolesForUser(obj.id);
    // console.log("User.orgRoles", ret, ret[0].roles)
    return ret;
  };

  obj.Org = {
    roles(obj, args, context) {
      console.log('Org.roles - resolver', args);
      return context.loaders.getRolesForOrgs.load(obj.id);
    }
  };

  obj.OrgRoleInfo = {
    orgId(obj) {
      return obj.orgId ? obj.orgId : obj.id ? obj.id : null;
    },
    orgName(obj) {
      return obj.orgName ? obj.orgName : obj.name ? obj.name : null;
    },
    scopes(obj) {
      return obj.scopes ? obj.scopes : null;
    },
    roles(obj) {
      return obj.roles ? obj.roles : null;
    }
  };
}

if (entities.serviceaccounts.enabled === true) {
  // TODO
}

export default pubsub => obj;
