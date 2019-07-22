import { ApolloServer, AuthenticationError, ApolloError } from 'apollo-server-express';
import { formatResponse } from 'apollo-logger';
import { GraphQLSchema } from 'graphql';
import 'isomorphic-fetch';

import { log } from '@gqlapp/core-common';
import ServerModule from '@gqlapp/module-server-ts';
import settings from '@gqlapp/config';

export default (schema: GraphQLSchema, modules: ServerModule) => {
  return new ApolloServer({
    schema,
    context: async ({ req, res }: { req: Request; res: Response }) => ({
      ...(await modules.createContext(req, res)),
      req,
      res
    }),
    formatError: (error: ApolloError) =>
      error.message === 'Not Authenticated!' ? new AuthenticationError(error.message) : error,
    formatResponse: (response: any, options: { [key: string]: any }) =>
      settings.app.logging.apolloLogging
        ? formatResponse({ logger: log.debug.bind(log) }, response, options)
        : response,
    tracing: !!settings.engine.apiKey,
    cacheControl: !!settings.engine.apiKey,
    engine: settings.engine.apiKey ? { apiKey: settings.engine.apiKey } : false,
    playground: false
  });
};
