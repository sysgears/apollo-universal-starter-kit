import DataLoader from 'dataloader';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import Feature from '../../connector';

import UserDAO from './lib';

const User = new UserDAO();

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => {
    return {
      User,

      loaders: {
        getBriefForUserIds: new DataLoader(User.getBriefForUserIds),
        getOrgsForUserIds: new DataLoader(User.getOrgsForUserIds),
        getGroupsForUserIds: new DataLoader(User.getGroupsForUserIds),
        getOrgsForUserIdsViaGroups: new DataLoader(User.getOrgsForUserIdsViaGroups)
      }
    };
  }
});
