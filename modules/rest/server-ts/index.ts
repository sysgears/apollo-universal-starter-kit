import ServerModule from '@gqlapp/module-server-ts';
import { createSchema, GraphQLModule } from '@gqlapp/graphql-server-ts';
import { Express } from 'express';

import createRestAPI from './createRestAPI';

const ref: { modules: GraphQLModule } = { modules: null };

const middleware = (app: Express) => createRestAPI(app, createSchema(ref.modules), ref.modules);

export default new ServerModule({
  onAppCreate: [(modules: GraphQLModule) => (ref.modules = modules)],
  middleware: [middleware]
});
