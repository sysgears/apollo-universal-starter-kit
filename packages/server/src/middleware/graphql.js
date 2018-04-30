import { graphqlExpress } from 'apollo-server-express';
import { formatResponse } from 'apollo-logger';
import 'isomorphic-fetch';

import schema from '../api/schema';
import modules from '../modules';
import settings from '../../../../settings';
import log from '../../../common/log';

export default async (req, res, next) => {
  try {
    const context = await modules.createContext(req, res);

    graphqlExpress(() => ({
      schema,
      context: { ...context, req, res },
      debug: false,
      formatError: error => {
        log.error('GraphQL execution error:', error);
        return error;
      },
      formatResponse: (response, options) =>
        settings.app.logging.apolloLogging
          ? formatResponse({ logger: log.debug.bind(log) }, response, options)
          : response,
      tracing: !!settings.engine.engineConfig.apiKey,
      cacheControl: !!settings.engine.engineConfig.apiKey
    }))(req, res, next);
  } catch (e) {
    // If createContext decided to finish response, don't pass error downwards
    if (!res.headersSent) {
      next(e);
    }
  }
};
