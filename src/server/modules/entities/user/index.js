import DataLoader from 'dataloader';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import Feature from '../../connector';

import UserDAO from './lib';

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => {
    const User = new UserDAO();

    const loaders = {
      getBriefForUserId: new DataLoader(User.getBriefForUserId),
      getBriefForUserIds: new DataLoader(User.getBriefForUserIds)
    };

    return {
      User,
      loaders
    };
  }
});
