/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import FieldError from '../../../../common/FieldError';
import { withAuth } from '../../../../common/authValidation';
import { reconcileBatchOneToOne, reconcileBatchOneToMany, reconcileBatchManyToMany } from '../../../sql/helpers';

import settings from '../../../../../settings';

export default function addResolvers(obj) {
  obj = addTypeResolvers(obj);
  obj = addQueries(obj);
  obj = addMutations(obj);
  return obj;
}

function addTypeResolvers(obj) {
  obj.RoleInfo = {
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
  };

  obj.PermissionInfo = {
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
    resource(obj) {
      return obj.resource;
    },
    relation(obj) {
      return obj.relation;
    },
    verb(obj) {
      return obj.verb;
    }
  };

  return obj;
}

function addQueries(obj) {
  obj.Query.permissions = (obj, args, context) => {
    return context.Authz.getPermissions(args);
  };

  obj.Query.permission = (obj, args, context) => {
    return context.Authz.getPermissions({ ids: [args.id] });
  };
  return obj;
}

function addMutations(obj) {
  obj.Mutation.createPermission = (obj, args, context) => {
    try {
      const id = context.Authz.createPermission(args.input);
      const perm = context.Authz.getPermissions({ ids: [id] });
      return { permission: perm, errors: null };
    } catch (e) {
      return { permission: null, errors: [e] };
    }
  };

  obj.Mutation.updatePermission = (obj, args, context) => {
    return context.Authz.updatePermission(args.id, args.input);
  };

  obj.Mutation.deletePermission = (obj, args, context) => {
    return context.Authz.deletePermission(args.id);
  };

  return obj;
}
