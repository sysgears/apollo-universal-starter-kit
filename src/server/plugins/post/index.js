import DataLoader from 'dataloader';

import Post from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';

import Plugin from '../connector';

export default new Plugin({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => {
    const post = new Post();

    return {
      Post: post,
      loaders: {
        getCommentsForPostIds: new DataLoader(post.getCommentsForPostIds)
      }
    };
  }
});
