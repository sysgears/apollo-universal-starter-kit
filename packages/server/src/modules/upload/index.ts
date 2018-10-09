import express, { Express } from 'express';

import ServerModule from '../ServerModule';
import Upload from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';
import resources from './locales';

const middleware = (app: Express) => {
  app.use('/public', express.static('public'));
};

export default new ServerModule({
  schema: [schema],
  createResolversFunc: [createResolvers],
  createContextFunc: [() => ({ Upload: new Upload() })],
  middleware: [middleware],
  localization: [{ ns: 'upload', resources }]
});
