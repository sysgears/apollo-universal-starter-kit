import { graphqlExpress } from 'apollo-server-express';
import 'isomorphic-fetch';

import log from '../../common/log';
import schema from '../api/schema';
import modules from '../modules';

export default (SECRET) => graphqlExpress(() => {
  try {
    return {
      schema,
      context:
        {
          ...modules.createContext(),
          SECRET
        }
    };
  } catch (e) {
    log(e.stack);
  }
});
