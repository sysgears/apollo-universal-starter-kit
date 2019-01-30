import schemaDocument from './schema.graphql';
import createResolvers from './resolvers';
import { isApiExternal } from '@gqlapp/core-common';
import { Express } from 'express';
import ServerModule, { SharedOptions } from '@gqlapp/module-server-ts';

import createApolloServer from './createApolloServer';

const middleware = (app: Express, { schema, modules }: SharedOptions) => {
  if (!isApiExternal) {
    const graphqlServer = createApolloServer(schema, modules);
    graphqlServer.applyMiddleware({ app, path: __API_URL__, cors: { credentials: true, origin: true } });
  }
};

export default new ServerModule({
  schema: [schemaDocument],
  createResolversFunc: [createResolvers],
  middleware: [middleware]
});
