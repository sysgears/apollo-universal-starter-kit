import { graphqlExpress } from 'apollo-server-express';
import 'isomorphic-fetch';

import schema from '../api/schema';
import modules from '../modules';
import settings from '../../../settings';
import log from '../../common/log';

export default async (req, res, next) => {
  try {
    const context = await modules.createContext(req, res);

    graphqlExpress(() => ({
      schema,
      context,
      debug: false,
      formatError: error => {
        log.error('GraphQL execution error:', error);
        return error;
      },
      tracing: !!settings.engine.engineConfig.apiKey,
      cacheControl: !!settings.engine.engineConfig.apiKey
    }))(req, res, next);
  } catch (e) {
    next(e);
  }
};
