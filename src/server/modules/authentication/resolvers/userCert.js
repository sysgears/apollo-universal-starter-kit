import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import { reconcileBatchOneToMany } from '../../../sql/helpers';

export default function addResolvers(obj) {
  obj.UserAuth.certificates = createBatchResolver(async (source, args, context) => {
    let ids = _.uniq(source.map(s => s.userId));
    const certs = await context.Authn.getCertificatesForUsers(ids);
    const ret = reconcileBatchOneToMany(source, certs, 'userId');
    return ret;
  });

  return obj;
}
