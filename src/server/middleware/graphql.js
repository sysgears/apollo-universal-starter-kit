import { graphqlExpress } from 'apollo-server-express';
import 'isomorphic-fetch';
import OpticsAgent from 'optics-agent';

import log from '../../common/log';
import schema from '../api/schema';
import modules from '../modules';

export default graphqlExpress(async req => {
  try {
    return {
      schema,
      context: Object.assign({ opticsContext: OpticsAgent.context(req) }, await modules.createContext(req))
    };
  } catch (e) {
    log(e.stack);
  }
});
