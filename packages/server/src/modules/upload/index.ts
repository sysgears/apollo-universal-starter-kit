import express, { Express } from 'express';

import Feature from '../connector';
import Upload from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';
import resources from './locales';

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => ({ Upload: new Upload() }),
  middleware: (app: Express) => {
    app.use('/public', express.static('public'));
  },
  localization: { ns: 'upload', resources }
});
