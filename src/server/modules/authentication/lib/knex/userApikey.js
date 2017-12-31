import { camelizeKeys } from 'humps';

import {
  listAdapter,
  getAdapter,
  createWithoutIdAdapter,
  deleteMultiConditionAdapter,
  getManyRelationAdapter
} from '../../../../stores/sql/knex/helpers/crud';

import selectAdapter from '../../../../stores/sql/knex/helpers/select';

export const listUserApiKey = listAdapter({ table: 'user_apikeys' });
export const pageUserApiKey = listAdapter({ table: 'user_apikeys' });
export const createUserApiKey = createWithoutIdAdapter({ table: 'user_apikeys' });
export const deleteUserApiKey = deleteMultiConditionAdapter({ table: 'user_apikeys' });

export const getUserFromApiKey = getAdapter({ table: 'user_apikeys', idField: 'key' });

export const getApiKeysForUserIds = getManyRelationAdapter({
  table: 'user_apikeys',
  elemField: 'name',
  collectionField: 'user_id'
});

export const searchUserApiKey = async (args, trx) => {
  const ret = await searchUserApiKeySelector(args, trx);
  return camelizeKeys(ret);
};

const searchUserApiKeySelector = selectAdapter({
  table: 'user_apikeys',
  filters: [
    {
      field: 'user_id',
      compare: '=',
      valueExtractor: args => args.userId
    },
    {
      bool: 'and',
      field: 'name',
      compare: '=',
      valueExtractor: args => args.name
    }
  ]
});
