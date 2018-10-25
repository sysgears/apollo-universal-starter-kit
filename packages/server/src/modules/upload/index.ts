import express, { Express } from 'express';

import ServerModule from '../ServerModule';
import * as sql from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';
import resources from './locales';
import fileSystemStorage from './FileSystemStorage';

const middleware = (app: Express) => {
  app.use('/public', express.static('public'));
};

export default new ServerModule({
  schema: [schema],
  data: {
    fileSystemStorage
  },
  createResolversFunc: [createResolvers as any],
  createContextFunc: [() => ({ Upload: new sql.Upload() })],
  middleware: [middleware],
  localization: [{ ns: 'upload', resources }]
});
