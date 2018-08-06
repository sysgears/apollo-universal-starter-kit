import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import { formatResponse } from 'apollo-logger';
import { MemcachedCache } from 'apollo-server-memcached';
import 'isomorphic-fetch';

import modules from './modules/index';
import schema from './api/schema';
import settings from '../../../settings';
import log from '../../common/log';
import { internalHost } from './net';

export default () => {
  return new ApolloServer({
    schema,
    context: async ({ req, res }) => ({ ...(await modules.createContext(req, res)), req, res }),
    formatError: error => {
      return error.message === 'Not Authenticated!' ? new AuthenticationError(error) : error;
    },
    formatResponse: (response, options) =>
      settings.app.logging.apolloLogging
        ? formatResponse({ logger: log.debug.bind(log) }, response, options)
        : response,
    tracing: !!settings.engine.apiKey,
    cacheControl: !!settings.engine.apiKey,
    engine: settings.engine.apiKey
      ? {
          apiKey: settings.engine.apiKey
        }
      : false,
    playground: false,
    persistedQueries: {
      cache: new MemcachedCache(
        [internalHost],
        { retries: 10, retry: 10000 } // Options
      )
    }
  });
};
