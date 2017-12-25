import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import { reconcileBatchOneToMany } from '../../../stores/sql/knex/helpers/batching';

export default function addResolvers(obj) {
  obj.UserAuth.oauths = createBatchResolver(async (source, args, context) => {
    let ids = _.uniq(source.map(s => s.userId));
    const oauths = await context.Authn.getOAuthsForUsers(ids);
    const ret = reconcileBatchOneToMany(source, oauths, 'userId');
    return ret;
  });

  return obj;
}
