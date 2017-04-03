import { graphqlExpress } from 'graphql-server-express'
import 'isomorphic-fetch'
import DataLoader from 'dataloader'

import schema from '../api/schema'
import Count from '../sql/count'
import Post from '../sql/post'

import { app as settings } from '../../../package.json'

if (__DEV__ && settings.debugSQL) {
  require('../sql/debug');
}
export default graphqlExpress(() => {

  const post = new Post();

  const loaders = {
    getCommentsForPostIds: new DataLoader(post.getCommentsForPostIds),
  };

  return {
    schema,
    context: {
      Count: new Count(),
      Post: post,
      loaders,
    },
  };
});