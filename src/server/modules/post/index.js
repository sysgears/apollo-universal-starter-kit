import DataLoader from 'dataloader';

import Post from './sql';
import schema from './schema.graphqls';
import createResolvers from './resolvers';

import Feature from '../connector';

export default new Feature({
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
