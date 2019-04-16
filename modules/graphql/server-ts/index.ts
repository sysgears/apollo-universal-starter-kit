import schemaDocument from './schema.graphql';
import createResolvers from './resolvers';
import { isApiExternal } from '@gqlapp/core-common';
import ServerModule, { TWare } from '@gqlapp/module-server-ts';

import graphiqlMiddleware from './graphiql';
import createApolloServer from './createApolloServer';

const middleware: TWare = (app, appContext, graphQLConfig) => {
  app.get('/graphiql', graphiqlMiddleware);

  if (!isApiExternal) {
    const graphqlServer = createApolloServer(graphQLConfig);
    graphqlServer.applyMiddleware({ app, path: __API_URL__, cors: { credentials: true, origin: true } });
  }
};

export default new ServerModule({
  schema: [schemaDocument],
  createResolversFunc: [createResolvers],
  middleware: [middleware]
});
