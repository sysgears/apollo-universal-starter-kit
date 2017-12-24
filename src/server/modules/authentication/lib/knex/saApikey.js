import {
  listAdapter,
  findAdapter,
  getAdapter,
  createWithoutIdAdapter,
  deleteMultiConditionAdapter,
  getManyRelationAdapter
} from '../../../../sql/crud';

export const searchServiceAccountApiKey = findAdapter('serviceaccount_apikeys');

export const getServiceAccountFromApiKey = getAdapter('serviceaccount_apikeys', 'key');
export const getApiKeysForServiceAccounts = getManyRelationAdapter('serviceaccount_apikeys', {
  idField: 'serviceaccountId',
  elemField: 'name',
  collectionField: 'serviceaccountId'
});

export const listServiceAccountApiKey = listAdapter('serviceaccount_apikeys');
export const createServiceAccountApiKey = createWithoutIdAdapter('serviceaccount_apikeys');
export const deleteServiceAccountApiKey = deleteMultiConditionAdapter('serviceaccount_apikeys');
