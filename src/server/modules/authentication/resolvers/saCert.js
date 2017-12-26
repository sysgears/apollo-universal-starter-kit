import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import { reconcileBatchOneToMany } from '../../../stores/sql/knex/helpers/batching';

export default function addResolvers(obj) {
  obj.ServiceAccountAuth.certificates = createBatchResolver(async (source, args, context) => {
    let ids = _.uniq(source.map(s => s.serviceaccountId));
    const certs = await context.Authn.getCertificatesForServiceAccounts({ ids });
    const ret = reconcileBatchOneToMany(source, certs, 'serviceaccountId');
    return ret;
  });

  return obj;
}
