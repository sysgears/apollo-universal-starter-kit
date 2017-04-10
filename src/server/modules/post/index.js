import DataLoader from 'dataloader';

import Post from './sql';

export { default as schema } from './schema.graphqls';
export { default as createResolvers } from './resolvers';
export { default as subscriptionsSetup } from './subscriptions_setup';

export const createContext = () => {
  const post = new Post();

  return {
    Post: post,
    loaders: {
      getCommentsForPostIds: new DataLoader(post.getCommentsForPostIds),
    }
  };
};
