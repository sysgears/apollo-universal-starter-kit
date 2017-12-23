/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import FieldError from '../../../../common/FieldError';
import { withAuth } from '../../../../common/authValidation';
import { reconcileBatchOneToOne, reconcileBatchOneToMany, reconcileBatchManyToMany } from '../../../sql/helpers';

import settings from '../../../../../settings';

const entities = settings.entities;

let obj = {
  Query: {},

  RoleInfo: {
    id(obj) {
      return obj.roleId ? obj.roleId : obj.id;
    },
    name(obj) {
      return obj.roleName ? obj.roleName : obj.name;
    },
    displayName(obj) {
      return obj.displayName;
    },
    description(obj) {
      return obj.description;
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
      let ids = _.uniq(source.map(s => s.userId));
      const roles = await context.Authz.getUserRolesForUsers(ids);
      const ret = reconcileBatchOneToMany(source, roles, 'userId');
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
  obj.User.groupRoles = createBatchResolver(async (source, args, context) => {
    let ids = _.uniq(source.map(s => s.userId));
    const roles = await context.Authz.getGroupRolesForUsers(ids);
    const ret = reconcileBatchOneToMany(source, roles, 'userId');
    return ret;
  });

  obj.Group = {
    roles: createBatchResolver(async (source, args, context) => {
      let ids = _.uniq(source.map(s => s.groupId));
      const roles = await context.Authz.getGroupRolesForGroups(ids);
      const ret = reconcileBatchOneToMany(source, roles, 'groupId');
      return ret;
    })
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
  obj.User.orgRoles = createBatchResolver(async (source, args, context) => {
    let ids = _.uniq(source.map(s => s.userId));
    const roles = await context.Authz.getOrgRolesForUsers(ids);
    const ret = reconcileBatchOneToMany(source, roles, 'userId');
    return ret;
  });

  obj.Org = {
    roles: createBatchResolver(async (source, args, context) => {
      let ids = _.uniq(source.map(s => s.orgId));
      const roles = await context.Authz.getOrgRolesForOrgs(ids);
      const ret = reconcileBatchOneToMany(source, roles, 'orgId');
      return ret;
    })
  };

  obj.OrgRoleInfo = {
    orgId(obj) {
      return obj.orgId ? obj.orgId : obj.id;
    },
    orgName(obj) {
      return obj.orgName ? obj.orgName : obj.name;
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
