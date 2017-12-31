// import { camelizeKeys } from 'humps';

import {
  getAdapter,
  listAdapter,
  pagingAdapter,
  createWithIdGenAdapter,
  createWithIdAdapter,
  updateAdapter,
  deleteAdapter
} from '../../../../stores/sql/knex/helpers/crud';

// import selectAdapter from '../../../../stores/sql/knex/helpers/select';

/*eslint-disable no-unused-vars*/

export default class User {
  list = listAdapter({ table: 'users', selects: ['*', 'id AS user_id'] });
  paging = pagingAdapter({ table: 'users', selects: ['*', 'id AS user_id'] });
  getMany = listAdapter({ table: 'users', selects: ['*', 'id AS user_id'] });

  get = getAdapter({ table: 'users', selects: ['*', 'id AS user_id'] });
  getByName = getAdapter({ table: 'users', idField: 'name', selects: ['*', 'id AS user_id'] });

  create = createWithIdGenAdapter({ table: 'users' });
  update = updateAdapter({ table: 'users' });
  delete = deleteAdapter({ table: 'users' });

  getProfile = getAdapter({ table: 'user_profile', idField: 'user_id' });
  getProfileMany = listAdapter({ table: 'user_profile', idField: 'user_id' });
  getProfilePublicMany = listAdapter({
    table: 'user_profile',
    idField: 'user_id',
    selects: ['user_id', 'display_name', 'language', 'locale']
  });
  createProfile = createWithIdAdapter({ table: 'user_profile', idField: 'user_id' });
  updateProfile = updateAdapter({ table: 'user_profile', idField: 'user_id' });
  deleteProfile = deleteAdapter({ table: 'user_profile', idField: 'user_id' });

  search = async (args, trx) => {
    const ret = await searchUsersSelector(args, trx);
    return ret;
  };
  searchPublic = async (args, trx) => {
    const ret = await searchUsersPublicSelector(args, trx);
    return ret;
  };
}

const searchUsersSelector = pagingAdapter({
  table: 'users AS u',
  joins: [
    {
      table: 'user_profile AS p',
      join: 'left',
      args: ['p.user_id', 'u.id']
    }
  ],
  filters: [
    {
      bool: 'or',
      table: 'u',
      field: 'id',
      compare: 'like',
      valueExtractor: args => `%${args.searchText}%`
    },
    {
      bool: 'or',
      table: 'u',
      field: 'email',
      compare: 'like',
      valueExtractor: args => `%${args.searchText}%`
    },
    {
      bool: 'or',
      table: 'p',
      field: 'display_name',
      compare: 'like',
      valueExtractor: args => `%${args.searchText}%`
    },
    {
      bool: 'or',
      table: 'p',
      field: 'first_name',
      compare: 'like',
      valueExtractor: args => `%${args.searchText}%`
    },
    {
      bool: 'or',
      table: 'p',
      field: 'last_name',
      compare: 'like',
      valueExtractor: args => `%${args.searchText}%`
    }
  ]
});

const searchUsersPublicSelector = pagingAdapter({
  table: 'users AS u',
  joins: [
    {
      table: 'user_profile AS p',
      join: 'left',
      args: ['p.user_id', 'u.id']
    }
  ],
  filters: [
    {
      bool: 'or',
      table: 'u',
      field: 'id',
      compare: 'like',
      valueExtractor: args => `%${args.searchText}%`
    },
    {
      bool: 'or',
      table: 'u',
      field: 'email',
      compare: 'like',
      valueExtractor: args => `%${args.searchText}%`
    },
    {
      bool: 'or',
      table: 'p',
      field: 'display_name',
      compare: 'like',
      valueExtractor: args => `%${args.searchText}%`
    }
  ]
});
