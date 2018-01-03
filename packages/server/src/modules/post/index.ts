import * as dl from 'dataloader';

import createResolvers from './resolvers';
import * as schema from './schema.graphqls';
import Post from './sql';

import Feature from '../connector';

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => {
    const post = new Post();

    return {
      Post: post,
      loaders: {
        getCommentsForPostIds: new dl(post.getCommentsForPostIds)
      }
    };
  }
});
