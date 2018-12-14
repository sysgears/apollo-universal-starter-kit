import express, { Express } from 'express';
import ServerModule from '@module/module-server-ts';

import Upload from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';
import resources from './locales';
import fileSystemStorage from './FileSystemStorage';

const middleware = (app: Express) => {
  app.use('/public', express.static('public'));
};

export * from './FileSystemStorage';

export default new ServerModule({
  schema: [schema],
  data: {
    fileSystemStorage
  },
  createResolversFunc: [createResolvers],
  createContextFunc: [() => ({ Upload: new Upload() })],
  middleware: [middleware],
  localization: [{ ns: 'upload', resources }]
});
