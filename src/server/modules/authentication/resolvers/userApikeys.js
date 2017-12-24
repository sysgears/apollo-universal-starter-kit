import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import { reconcileBatchOneToMany } from '../../../sql/helpers';

export default function addResolvers(obj) {
  obj.UserAuth.apikeys = createBatchResolver(async (source, args, context) => {
    let ids = _.uniq(source.map(s => s.userId));
    const apikeys = await context.Authn.getApiKeysForUsers(ids);
    const ret = reconcileBatchOneToMany(source, apikeys, 'userId');
    return ret;
  });

  return obj;
}
