import React from 'react';
import { graphql, compose } from 'react-apollo';

import UploadView from '../components/UploadView';
import FILES_QUERY from '../graphql/FilesQuery.graphql';
import UPLOAD_FILES from '../graphql/UploadFiles.graphql';
import REMOVE_FILE from '../graphql/RemoveFile.graphql';

class Upload extends React.Component {
  render() {
    return <UploadView {...this.props} />;
  }
}

const UploadWithApollo = compose(
  graphql(FILES_QUERY, {
    options: () => {
      return {
        fetchPolicy: 'cache-and-network'
      };
    },
    props({ data: { loading, error, files, refetch } }) {
      if (error) throw new Error(error);
      return { loading, files, refetch };
    }
  }),
  graphql(UPLOAD_FILES, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      uploadFiles: async files => {
        try {
          const { data: { uploadFiles } } = await mutate({
            variables: { files }
          });
          refetch();
          return uploadFiles;
        } catch (e) {
          return { error: e.graphQLErrors[0].message };
        }
      }
    })
  }),
  graphql(REMOVE_FILE, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      removeFile: async id => {
        try {
          const { data: { removeFile } } = await mutate({
            variables: { id }
          });
          refetch();
          return removeFile;
        } catch (e) {
          return { error: e.graphQLErrors[0].message };
        }
      }
    })
  })
)(Upload);

export default UploadWithApollo;
