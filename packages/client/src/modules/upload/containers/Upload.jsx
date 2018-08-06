import React from 'react';
import { graphql, compose } from 'react-apollo';

import UploadView from '../components/UploadView';
import FILES_QUERY from '../graphql/FilesQuery.graphql';
import UPLOAD_FILES from '../graphql/UploadFiles.graphql';
import REMOVE_FILE from '../graphql/RemoveFile.graphql';
import translate from '../../../i18n';

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  handleUploadFiles = async files => {
    const { uploadFiles } = this.props;
    const result = await uploadFiles(files);

    this.handleErrors(result);
  };

  handleRemoveFile = async id => {
    const { removeFile } = this.props;
    const result = await removeFile(id);

    this.handleErrors(result);
  };

  handleErrors(result) {
    this.setState({ error: result && result.error ? result.error : null });
  }

  render() {
    return (
      <UploadView
        {...this.props}
        error={this.state.error}
        handleRemoveFile={this.handleRemoveFile}
        handleUploadFiles={this.handleUploadFiles}
      />
    );
  }
}

export default compose(
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
          const {
            data: { uploadFiles }
          } = await mutate({
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
          const {
            data: { removeFile }
          } = await mutate({
            variables: { id }
          });

          refetch();
          return removeFile;
        } catch (e) {
          return { error: e.graphQLErrors[0].message };
        }
      }
    })
  }),
  translate('upload')
)(Upload);
