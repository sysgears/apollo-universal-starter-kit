import { graphqlExpress } from 'graphql-server-express'
import 'isomorphic-fetch'

import schema from '../api/schema'
import Count from '../sql/count'

export default graphqlExpress(() => {
  return {
    schema,
    context: {
      Count: new Count(),
    },
  };
});