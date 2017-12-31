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
      return obj.permissionId ? obj.permissionId : null;
    },
    permissionName(obj) {
      return obj.permissionName ? obj.permissionName : null;
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

  obj.Query.pagingPermissions = async (obj, args, context) => {
    const res = await context.Authz.pagingPermissions(args);
    return {
      data: res.results,
      total: res.count,
      pages: Math.trunc(res.count / args.limit) + 1
    };
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
