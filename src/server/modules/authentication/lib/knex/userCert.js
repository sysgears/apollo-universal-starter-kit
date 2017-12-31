/* eslint-disable no-unused-vars */
import _ from 'lodash';
import { camelizeKeys } from 'humps';

import {
  listAdapter,
  getAdapter,
  createWithoutIdAdapter,
  deleteMultiConditionAdapter,
  getManyRelationAdapter
} from '../../../../stores/sql/knex/helpers/crud';

import selectAdapter from '../../../../stores/sql/knex/helpers/select';

export const listUserCertificate = listAdapter({ table: 'user_certificates' });
export const pageUserCertificate = listAdapter({ table: 'user_certificates' });
export const createUserCertificate = createWithoutIdAdapter({ table: 'user_certificates' });
export const deleteUserCertificate = deleteMultiConditionAdapter({ table: 'user_certificates' });

export const getUserFromCertificate = getAdapter({ table: 'user_certificates', idField: 'serial' });

export const getCertificatesForUserIds = getManyRelationAdapter({
  table: 'user_certificates',
  elemField: 'name',
  collectionField: 'user_id'
});

export const searchUserCertificate = async (args, trx) => {
  const rows = await searchUserCertificateSelector(args, trx);
  return camelizeKeys(rows);
};

const searchUserCertificateSelector = selectAdapter({
  table: 'user_certificates',
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
