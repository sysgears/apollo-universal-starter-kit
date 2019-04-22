import { ApolloServer, AuthenticationError, ApolloError } from 'apollo-server-express';
import { formatResponse } from 'apollo-logger';
import 'isomorphic-fetch';
import { log } from '@gqlapp/core-common';
import { GraphQLConfigShape } from '@gqlapp/graphql-server-server-ts';

import settings from '../../../settings';

const {
  engine: { apiKey },
  app: { logging }
} = settings;

export default ({ schema, createGraphQLContext }: GraphQLConfigShape) => {
  const context = async ({ req, res }: { req: any; res: any }) => ({
    ...(await createGraphQLContext(req, res)),
    req,
    res
  });

  const formatError = (error: ApolloError) =>
    error.message === 'Not Authenticated!' ? new AuthenticationError(error.message) : error;

  const formatAndLogResponse = (response: any, options: { [key: string]: any }) =>
    logging.apolloLogging ? formatResponse({ logger: log.debug.bind(log) }, response, options) : response;

  return new ApolloServer({
    schema,
    context,
    formatError,
    formatResponse: formatAndLogResponse,
    tracing: !!apiKey,
    cacheControl: !!apiKey,
    engine: apiKey ? { apiKey } : false,
    playground: false
  });
};
