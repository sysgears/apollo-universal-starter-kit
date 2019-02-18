import ServerModule from '@gqlapp/module-server-ts';
import { createSchema } from '@gqlapp/core-server-ts';
import { Express } from 'express';

import createRestAPI from './createRestAPI';

const ref: { modules: ServerModule } = { modules: null };

const middleware = (app: Express) => createRestAPI(app, createSchema(ref.modules), ref.modules);

export default new ServerModule({
  onAppCreate: [(modules: ServerModule) => (ref.modules = modules)],
  middleware: [middleware]
});
