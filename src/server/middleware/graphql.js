import { graphqlExpress } from 'apollo-server-express';
import 'isomorphic-fetch';

import log from '../../common/log';
import schema from '../api/schema';
import modules from '../modules';

export default graphqlExpress(() => {
  try {
    return {
      schema,
      context: modules.createContext()
    };
  } catch (e) {
    log(e.stack);
  }
});
