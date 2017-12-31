import {
  listAdapter,
  pagingAdapter,
  createWithIdGenAdapter,
  updateAdapter,
  deleteAdapter
} from '../../../../stores/sql/knex/helpers/crud';

export const getPermissions = listAdapter({
  table: 'permissions',
  idField: 'id',
  selects: ['*', 'id AS permission_id']
});
export const pagingPermissions = pagingAdapter({
  table: 'permissions',
  idField: 'id',
  selects: ['*', 'id AS permission_id']
});
export const createPermission = createWithIdGenAdapter({ table: 'permissions' });
export const updatePermission = updateAdapter({ table: 'permissions' });
export const deletePermission = deleteAdapter({ table: 'permissions' });
