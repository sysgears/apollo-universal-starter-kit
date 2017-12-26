import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import { reconcileBatchOneToMany } from '../../../stores/sql/knex/helpers/batching';

export default function addResolvers(obj) {
  obj.ServiceAccountAuth.apikeys = createBatchResolver(async (source, args, context) => {
    let ids = _.uniq(source.map(s => s.serviceaccountId));
    const apikeys = await context.Authn.getApiKeysForServiceAccounts({ ids });
    const ret = reconcileBatchOneToMany(source, apikeys, 'serviceaccountId');
    return ret;
  });

  return obj;
}
