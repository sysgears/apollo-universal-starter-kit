import DataLoader from 'dataloader';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import Feature from '../../connector';

import ServiceAccountDAO from './lib';

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => {
    const sa = new ServiceAccountDAO();

    const loaders = {
      getOrgsForServiceAccountId: new DataLoader(sa.getOrgsForServiceAccountId),
      getGroupsForServiceAccountId: new DataLoader(sa.getGroupsForServiceAccountId),
      getOrgsForServiceAccountIdViaGroups: new DataLoader(sa.getOrgsForServiceAccountIdViaGroups)
    };

    return {
      ServiceAccount: sa,
      loaders
    };
  }
});
