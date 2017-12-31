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

  return obj;
}

function addQueries(obj) {
  return obj;
}

function addMutations(obj) {
  return obj;
}
