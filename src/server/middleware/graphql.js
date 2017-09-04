import { graphqlExpress } from 'apollo-server-express';
import 'isomorphic-fetch';

import log from '../../common/log';
import schema from '../api/schema';
import modules from '../modules';

export default (SECRET) => graphqlExpress((req) => {
  try {
    return {
      schema,
      context:
        {
          ...modules.createContext(),
          user: req.user,
          SECRET
        }
    };
  } catch (e) {
    log(e.stack);
  }
});
