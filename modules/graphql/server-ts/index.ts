import schemaDocument from './schema.graphql';
import createResolvers from './resolvers';
import { isApiExternal } from '@gqlapp/core-common';
import ServerModule, { Ware } from '@gqlapp/module-server-ts';

import graphiqlMiddleware from './graphiql';
import createApolloServer from './createApolloServer';

const middleware: Ware = (app, appContext, GraphQLConfigShape) => {
  app.get('/graphiql', graphiqlMiddleware);

  if (!isApiExternal) {
    const graphqlServer = createApolloServer(GraphQLConfigShape);
    graphqlServer.applyMiddleware({ app, path: __API_URL__, cors: { credentials: true, origin: true } });
  }
};

export default new ServerModule({
  schema: [schemaDocument],
  createResolversFunc: [createResolvers],
  middleware: [middleware]
});
