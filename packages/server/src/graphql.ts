import { ApolloServer, AuthenticationError, ApolloError } from 'apollo-server-express';
import { formatResponse } from 'apollo-logger';
import { GraphQLResponse } from '../../../node_modules/apollo-server-core/dist/runQuery';
import { Context } from '../../../node_modules/apollo-server-core';
import 'isomorphic-fetch';

import modules from './modules/index';
import schema from './api/schema';
import settings from '../../../settings';
import log from '../../common/log';

export default () => {
  return new ApolloServer({
    schema,
    context: async ({ req, res }: Context) => ({ ...(await modules.createContext(req, res)), req, res }),
    formatError: (error: ApolloError) =>
      error.message === 'Not Authenticated!' ? new AuthenticationError(error.message) : error,
    formatResponse: (response: GraphQLResponse, options: { [key: string]: any }) =>
      settings.app.logging.apolloLogging
        ? formatResponse({ logger: log.debug.bind(log) }, response, options)
        : response,
    tracing: !!settings.engine.apiKey,
    cacheControl: !!settings.engine.apiKey,
    engine: settings.engine.apiKey ? { apiKey: settings.engine.apiKey } : false,
    playground: false
  });
};
