import {
  listAdapter,
  pagingAdapter,
  createAdapter,
  updateAdapter,
  deleteAdapter
} from '../../../../stores/sql/knex/helpers/crud';

export const getPermissions = listAdapter('permissions', { idField: 'id', selects: ['*', 'id AS permissionId'] });
export const pagingPermissions = pagingAdapter('permissions', { idField: 'id', selects: ['*', 'id AS permissionId'] });
export const createPermission = createAdapter('permissions');
export const updatePermission = updateAdapter('permissions');
export const deletePermission = deleteAdapter('permissions');
