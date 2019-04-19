import ServerModule from '@gqlapp/module-server-ts';
import { createSchema, GraphQLServerModule } from '@gqlapp/graphql-server-ts';
import { Express } from 'express';

import createRestAPI from './createRestAPI';

const ref: { modules: GraphQLServerModule } = { modules: null };

const middleware = (app: Express) => createRestAPI(app, createSchema(ref.modules), ref.modules);

export default new ServerModule({
  onAppCreate: [(modules: GraphQLServerModule) => (ref.modules = modules)],
  middleware: [middleware]
});
