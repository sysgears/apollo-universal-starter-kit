import {
  listAdapter,
  findAdapter,
  getAdapter,
  createWithoutIdAdapter,
  deleteMultiConditionAdapter,
  getManyRelationAdapter
} from '../../../../stores/sql/knex/helpers/crud';

export const searchServiceAccountCertificate = findAdapter('serviceaccount_certificates');

export const getServiceAccountFromCertificate = getAdapter('serviceaccount_certificates', 'key');
export const getCertificatesForServiceAccounts = getManyRelationAdapter('serviceaccount_certificates', {
  idField: 'serviceaccountId',
  elemField: 'name',
  collectionField: 'serviceaccountId'
});

export const listServiceAccountCertificate = listAdapter('serviceaccount_certificates');
export const createServiceAccountCertificate = createWithoutIdAdapter('serviceaccount_certificates');
export const deleteServiceAccountCertificate = deleteMultiConditionAdapter('serviceaccount_certificates');

export async function getServiceAccountFromSerial(serial, trx) {
  return getServiceAccountFromCertificate(serial, trx);
}
