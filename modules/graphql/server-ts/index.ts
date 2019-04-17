import schemaDocument from './schema.graphql';
import createResolvers from './resolvers';
import { isApiExternal } from '@gqlapp/core-common';
import ServerModule, { MiddlewareFunc } from '@gqlapp/module-server-ts';

import graphiqlMiddleware from './graphiql';
import createApolloServer from './createApolloServer';

const middleware: MiddlewareFunc = (app, appContext, graphQLConfigShape) => {
  app.get('/graphiql', graphiqlMiddleware);

  if (!isApiExternal) {
    const graphqlServer = createApolloServer(graphQLConfigShape);
    graphqlServer.applyMiddleware({ app, path: __API_URL__, cors: { credentials: true, origin: true } });
  }
};

export * from './api';
export * from './types';

export default new ServerModule({
  schema: [schemaDocument],
  createResolversFunc: [createResolvers],
  middleware: [middleware]
});
