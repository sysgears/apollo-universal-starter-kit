import { BatchHttpLink } from 'apollo-link-batch-http';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import extractFiles from 'extract-files';
import { cloneDeep } from 'lodash';

export default uri =>
  ApolloLink.split(
    ({ variables }) => extractFiles(cloneDeep(variables)).length > 0,
    createUploadLink({ uri, credentials: 'include' }),
    new BatchHttpLink({
      uri,
      credentials: 'include'
    })
  );
