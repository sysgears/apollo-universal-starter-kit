/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import { authSwitch } from '../../../../common/auth/server';
import FieldError from '../../../../common/FieldError';

import {
  reconcileBatchOneToOne,
  reconcileBatchOneToMany,
  reconcileBatchManyToMany
} from '../../../stores/sql/knex/helpers/batching';

import settings from '../../../../../settings';

export default function addResolvers(obj) {
  obj = addTypes(obj);
  obj = addQueries(obj);
  obj = addMutations(obj);
  return obj;
}

function addTypes(obj) {
  obj.PermissionInfo = {
    id(obj) {
      return obj.permissionId ? obj.permissionId : obj.id;
    },
    name(obj) {
      return obj.permissionName ? obj.permissionName : obj.name;
    },
    permissionId(obj) {
      return obj.permissionId ? obj.permissionId : obj.name;
    },
    permissionName(obj) {
      return obj.permissionName ? obj.permissionName : obj.name;
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

  obj.Query.pagingPermissions = async (obj, args, context) => {
    const ret = await context.Authz.pagingPermissions(args);
    return ret;
  };

  obj.Query.searchPermissions = async (obj, args, context) => {
    const ret = await context.Authz.searchPermissions(args);
    return ret;
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
