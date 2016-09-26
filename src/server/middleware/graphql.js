import { apolloExpress } from 'apollo-server'
import 'isomorphic-fetch'

import schema from '../api/schema'
import Count from '../sql/count'

export default apolloExpress(() => {
  return {
    schema,
    context: {
      Count: new Count(),
    },
  };
});