import { apolloUploadExpress } from 'apollo-upload-server';
import { constructUploadOptions } from 'apollo-fetch-upload';
import Upload from './sql';

import schema from './schema.graphqls';
import createResolvers from './resolvers';
import Feature from '../connector';

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => ({ Upload: new Upload() }),
  middleware: app => {
    app.use('/graphql', apolloUploadExpress({ uploadDir: './upload' }));
  },
  createFetchOptions: constructUploadOptions
});
