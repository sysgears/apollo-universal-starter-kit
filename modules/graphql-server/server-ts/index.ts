import { isApiExternal } from '@gqlapp/core-common';
import ServerModule from '@gqlapp/module-server-ts';

import { createSchema } from './api';
import createResolvers from './resolvers';
import schemaDocument from './schema.graphql';
import graphiqlMiddleware from './graphiql';
import createApolloServer from './createApolloServer';

import { createApiServer } from './server';

let graphqlServer: any;

const onAppCreate = (modules: ServerModule): void => {
  const schema = createSchema(modules);

  type CreateGraphQLContext = (req: Request, res: Response) => any;
  const createGraphQLContext: CreateGraphQLContext = (req, res) => modules.createContext(req, res);
  graphqlServer = createApolloServer({ createGraphQLContext, schema });

  modules.appContext.createGraphQLContext = createGraphQLContext;
  modules.appContext.schema = schema;
};

export const middleware = (app: any): void => {
  const cors = { credentials: true, origin: true };

  app.get('/graphiql', graphiqlMiddleware);

  if (!isApiExternal) {
    graphqlServer.applyMiddleware({ app, path: __API_URL__, cors });
  }
};

export * from './api';
export * from './server';

export default new ServerModule({
  onAppCreate: [onAppCreate, createApiServer],
  middleware: [middleware],
  schema: [schemaDocument],
  createResolversFunc: [createResolvers]
});
