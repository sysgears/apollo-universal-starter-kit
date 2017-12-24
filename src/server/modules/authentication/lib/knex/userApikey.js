import {
  listAdapter,
  findAdapter,
  getAdapter,
  createWithoutIdAdapter,
  deleteMultiConditionAdapter,
  getManyRelationAdapter
} from '../../../../sql/crud';

export const searchUserApiKey = findAdapter('user_apikeys');

export const getUserFromApiKey = getAdapter('user_apikeys', 'key');
export const getApiKeysForUsers = getManyRelationAdapter('user_apikeys', {
  idField: 'userId',
  elemField: 'name',
  collectionField: 'userId'
});

export const listUserApiKey = listAdapter('user_apikeys');
export const createUserApiKey = createWithoutIdAdapter('user_apikeys');
export const deleteUserApiKey = deleteMultiConditionAdapter('user_apikeys');
