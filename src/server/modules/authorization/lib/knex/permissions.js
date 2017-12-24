import { listAdapter, createAdapter, updateAdapter, deleteAdapter } from '../../../../sql/crud';

export const getPermissions = listAdapter('permissions', { idField: 'id', selects: ['*', 'id AS permissionId'] });
export const createPermission = createAdapter('permissions');
export const updatePermission = updateAdapter('permissions');
export const deletePermission = deleteAdapter('permissions');
