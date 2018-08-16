import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import { formatResponse } from 'apollo-logger';
import 'isomorphic-fetch';

import modules from './modules/index';
import schema from './api/schema';
import settings from '../../../settings';
import log from '../../common/log';

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
    playground: {
      tabs: [
        {
          endpoint: '/graphql',
          query: '{\n' + '  serverCounter {\n' + '    amount\n' + '  }\n' + '}'
        }
      ]
    }
  });
};
