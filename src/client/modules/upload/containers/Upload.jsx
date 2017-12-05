import React from 'react';
import { graphql, compose } from 'react-apollo';

import UploadView from '../components/UploadView';
import FILES_QUERY from '../graphql/FilesQuery.graphql';
import UPLOAD_FILE from '../graphql/UploadFile.graphql';
import REMOVE_FILE from '../graphql/RemoveFile.graphql';

class Upload extends React.Component {
  render() {
    return <UploadView {...this.props} />;
  }
}

const UploadWithApollo = compose(
  graphql(FILES_QUERY, {
    props({ data: { loading, error, files, refetch } }) {
      if (error) throw new Error(error);
      return { loading, files, refetch };
    }
  }),
  graphql(UPLOAD_FILE, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      uploadFile: async file => {
        try {
          const { data: { uploadFile } } = await mutate({
            variables: { file }
          });

          refetch();

          if (uploadFile.errors) {
            return { errors: uploadFile.errors };
          }

          return uploadFile;
        } catch (e) {
          console.log(e.graphQLErrors);
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

          if (removeFile.errors) {
            return { errors: removeFile.errors };
          }

          return removeFile;
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(Upload);

export default UploadWithApollo;
