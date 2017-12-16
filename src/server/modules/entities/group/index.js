import DataLoader from 'dataloader';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import Feature from '../../connector';

import GroupDAO from './lib';

const Group = new GroupDAO();

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => {
    return {
      Group,

      loaders: {
        getOrgsForGroupId: new DataLoader(Group.getOrgsForGroupId),
        getUsersForGroupId: new DataLoader(Group.getUsersForGroupId),
        getServiceAccountsForGroupId: new DataLoader(Group.getServiceAccountsForGroupId)
      }
    };
  }
});
