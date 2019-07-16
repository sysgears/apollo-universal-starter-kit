import { BatchHttpLink } from 'apollo-link-batch-http';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import { extractFiles } from 'extract-files';

export default uri =>
  ApolloLink.split(
    ({ variables }) => extractFiles(variables).files.size > 0,
    createUploadLink({ uri, credentials: 'include' }),
    new BatchHttpLink({
      uri,
      credentials: 'include'
    })
  );
