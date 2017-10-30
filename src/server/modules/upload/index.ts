import { constructUploadOptions } from 'apollo-fetch-upload';
import { apolloUploadExpress } from 'apollo-upload-server';
import Upload from './sql';

import Feature from '../connector';
import createResolvers from './resolvers';
import * as schema from './schema.graphqls';

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => ({ Upload: new Upload() }),
  middleware: app => {
    app.use('/graphql', apolloUploadExpress({ uploadDir: './upload' }));
  },
  createFetchOptions: constructUploadOptions
});
