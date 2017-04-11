import { graphqlExpress } from 'graphql-server-express';
import 'isomorphic-fetch';
import log from 'common/log';

import schema from '../api/schema';
import { createContext } from '../modules';

export default graphqlExpress(() => {
  try {
    return {
      schema,
      context: createContext()
    };
  } catch (e) {
    log(e.stack);
  }
});