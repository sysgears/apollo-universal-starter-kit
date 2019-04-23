import { isApiExternal } from '@gqlapp/core-common';
import ServerModule from '@gqlapp/module-server-ts';

import createResolvers from './resolvers';
import schemaDocument from './schema.graphql';
import graphiqlMiddleware from './graphiql';
import createApolloServer from './createApolloServer';

const onAppCreate = (modules: ServerModule): void => {
  const { schema } = modules.appContext;

  type CreateGraphQLContext = (req: Request, res: Response) => any;
  const createGraphQLContext: CreateGraphQLContext = (req, res) => modules.createContext(req, res);
  const graphqlServer = createApolloServer({ createGraphQLContext, schema });
  modules.appContext.createGraphQLContext = createGraphQLContext;
  modules.appContext.graphqlServer = graphqlServer;
};

const middleware = (app: any, appContext: any): void => {
  const { graphqlServer } = appContext;
  const cors = { credentials: true, origin: true };

  app.get('/graphiql', graphiqlMiddleware);

  if (!isApiExternal) {
    graphqlServer.applyMiddleware({ app, path: __API_URL__, cors });
  }
};

export * from './api';

export default new ServerModule({
  onAppCreate: [onAppCreate],
  middleware: [middleware],
  schema: [schemaDocument],
  createResolversFunc: [createResolvers]
});
