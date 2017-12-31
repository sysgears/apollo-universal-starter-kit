import { camelizeKeys } from 'humps';

import {
  listAdapter,
  createWithoutIdAdapter,
  updateMultiConditionAdapter,
  deleteMultiConditionAdapter,
  getManyRelationAdapter
} from '../../../../stores/sql/knex/helpers/crud';

import selectAdapter from '../../../../stores/sql/knex/helpers/select';

export const listUserOAuth = listAdapter({ table: 'user_oauths' });
export const createUserOAuth = createWithoutIdAdapter({ table: 'user_oauths' });
export const updateUserOAuth = updateMultiConditionAdapter({ table: 'user_oauths' });
export const deleteUserOAuth = deleteMultiConditionAdapter({ table: 'user_oauths' });

export const getOAuthsForUserIds = getManyRelationAdapter({
  table: 'user_oauths',
  elemField: 'provider',
  collectionField: 'user_id'
});

export const getUsersForOAuthProviders = getManyRelationAdapter({
  table: 'user_oauths',
  elemField: 'user_id',
  collectionField: 'provider'
});

export async function searchUserByOAuthOrEmail(args, trx) {
  const ret = await searchUserByOAuthOrEmailSelector(args, trx);
  return camelizeKeys(ret);
}
const searchUserByOAuthOrEmailSelector = selectAdapter({
  name: 'searchUserOauths',
  table: 'users',
  joins: [
    {
      table: 'user_oauths',
      join: 'left',
      args: ['user_oauths.user_id', 'users.id']
    }
  ],
  filters: [
    {
      applyWhen: args => args.provider,
      table: 'user_oauths',
      field: 'provider',
      compare: '=',
      valueExtractor: args => args.provider
    },
    {
      applyWhen: args => args.email,
      bool: 'or',
      table: 'users',
      field: 'email',
      compare: '=',
      valuesExtractor: args => args.email
    }
  ]
});

export async function searchUserOAuths(args, trx) {
  const ret = await searchUserOAuthsSelector(args, trx);
  return camelizeKeys(ret);
}
const searchUserOAuthsSelector = selectAdapter({
  name: 'searchUserOauths',
  table: 'user_oauths',
  filters: [
    {
      field: 'user_id',
      compare: '=',
      valueExtractor: args => args.id
    },
    {
      applyWhen: args => args.provider,
      bool: 'and',
      field: 'provider',
      compare: '=',
      valueExtractor: args => args.provider
    },
    {
      applyWhen: args => args.providers,
      bool: 'and',
      field: 'provider',
      compare: 'in',
      valuesExtractor: args => args.providers
    }
  ]
});
