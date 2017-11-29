import { graphqlExpress } from 'apollo-server-express';
import 'isomorphic-fetch';

import schema from '../api/schema';
import modules from '../modules';
import settings from '../../../settings';
import log from '../../common/log';

export default graphqlExpress(async (req, res, next) => {
  try {
    return {
      schema,
      context: await modules.createContext(req, res),
      debug: false,
      formatError: error => {
        log.error('GraphQL execution error:', error);
        return error;
      },
      tracing: !!settings.engine.engineConfig.apiKey,
      cacheControl: !!settings.engine.engineConfig.apiKey
    };
  } catch (e) {
    next(e);
  }
});
