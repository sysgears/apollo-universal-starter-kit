import DataLoader from 'dataloader';

import Post from './sql';
import schema from './schema.graphqls';
import createResolvers from './resolvers';
import subscriptionsSetup from './subscriptions_setup';

import { addGraphQLSchema, addResolversFactory, addSubscriptionSetup, addContextFactory } from '../connector';

addGraphQLSchema(schema);
addResolversFactory(createResolvers);
addSubscriptionSetup(subscriptionsSetup);

addContextFactory(() => {
  const post = new Post();

  return {
    Post: post,
    loaders: {
      getCommentsForPostIds: new DataLoader(post.getCommentsForPostIds),
    }
  };
});
