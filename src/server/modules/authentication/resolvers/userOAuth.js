/* eslint-disable no-unused-vars */
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import { authSwitch } from '../../../../common/auth/server';

import { reconcileBatchOneToMany } from '../../../stores/sql/knex/helpers/batching';

export default function addResolvers(obj) {
  obj.UserAuth.oauths = createBatchResolver(async (source, args, context) => {
    let ids = _.uniq(source.map(s => s.userId));
    console.log('UserAuth.oauths - ids', ids);
    const oauths = await context.Authn.getOAuthsForUsers({ ids });
    console.log('UserAuth.oauths - oauths', oauths);
    const ret = reconcileBatchOneToMany(source, oauths, 'userId');
    console.log('UserAuth.oauths - ret', ret);
    return ret;
  });

  return obj;
}
