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

export const searchPermissions = async (args, trx) => {
  const ret = await searchPermissionsSelector(args, trx);
  return ret;
};

const searchPermissionsSelector = pagingAdapter({
  table: 'permissions',
  filters: [
    {
      bool: 'or',
      table: 'permissions',
      field: 'id',
      compare: 'like',
      valueExtractor: args => `${args.searchText}`
    },
    {
      bool: 'or',
      table: 'permissions',
      field: 'name',
      compare: 'like',
      valueExtractor: args => `${args.searchText}`
    },
    {
      bool: 'or',
      table: 'permissions',
      field: 'resource',
      compare: 'like',
      valueExtractor: args => `${args.searchText}`
    },
    {
      bool: 'or',
      table: 'permissions',
      field: 'verb',
      compare: 'like',
      valueExtractor: args => `${args.searchText}`
    },
    {
      bool: 'or',
      table: 'permissions',
      field: 'display_name',
      compare: 'like',
      valueExtractor: args => `${args.searchText}`
    },
    {
      bool: 'or',
      table: 'permissions',
      field: 'description',
      compare: 'like',
      valueExtractor: args => `${args.searchText}`
    }
  ]
});
