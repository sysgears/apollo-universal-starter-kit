import { ApolloServer } from 'apollo-server-express';
import { formatResponse } from 'apollo-logger';
import 'isomorphic-fetch';

import modules from '../modules';
import { schemas } from '../api/schema';
import settings from '../../../../settings';
import log from '../../../common/log';

export default () => {
  const createContext = async (req, res) => await modules.createContext(req, res);
  return new ApolloServer({
    typeDefs: schemas.typeDefs,
    resolvers: schemas.resolvers,
    context: async ({ req, res }) => ({ ...(await createContext(req, res)), req, res }),
    debug: false,
    formatError: error => {
      log.error('GraphQL execution error:', error);
      return error;
    },
    formatResponse: (response, options) =>
      settings.app.logging.apolloLogging
        ? formatResponse({ logger: log.debug.bind(log) }, response, options)
        : response,
    tracing: !!settings.engine.apiKey,
    cacheControl: !!settings.engine.apiKey,
    engine: {
      apiKey: settings.engine.apiKey
    }
  });
};
