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
        getOrgsForUserId: new DataLoader(User.getOrgsForUserId),
        getGroupsForUserId: new DataLoader(User.getGroupsForUserId),
        getOrgsForUserIdViaGroups: new DataLoader(User.getOrgsForUserIdViaGroups)
      }
    };
  }
});
