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
    props({ data: { loading, error, files } }) {
      if (error) throw new Error(error);
      return { loading, files };
    }
  }),
  graphql(UPLOAD_FILE, {
    props: ({ mutate }) => ({
      uploadFile: async file => {
        return await mutate({
          variables: { file }
        });
      }
    })
  }),
  graphql(REMOVE_FILE, {
    props: ({ mutate }) => ({
      removeFile: async id => {
        return await mutate({
          variables: { id }
        });
      }
    })
  })
)(Upload);

export default UploadWithApollo;
