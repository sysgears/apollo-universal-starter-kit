import DataLoader from 'dataloader';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import Feature from '../../connector';

import GroupDAO from './lib';

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => {
    const Group = new GroupDAO();

    const loaders = {
      getOrgsForGroupIds: new DataLoader(Group.getOrgsForGroupIds),
      getUsersForGroupIds: new DataLoader(Group.getUsersForGroupIds),
      getServiceAccountsForGroupIds: new DataLoader(Group.getServiceAccountsForGroupIds),

      getGroupsForUserIds: new DataLoader(Group.getGroupsForUserIds)
    };

    return {
      Group,
      loaders
    };
  }
});
