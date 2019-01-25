import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { translate } from '@gqlapp/i18n-client-react';
import UploadView from '../components/UploadView';
import FILES_QUERY from '../graphql/FilesQuery.graphql';
import UPLOAD_FILES from '../graphql/UploadFiles.graphql';
import REMOVE_FILE from '../graphql/RemoveFile.graphql';

class Upload extends React.Component {
  propTypes = {
    uploadFiles: PropTypes.func,
    removeFile: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  handleUploadFiles = async files => {
    const { uploadFiles } = this.props;
    try {
      await uploadFiles(files);
    } catch (e) {
      this.setState({ error: e.message });
    }
  };

  handleRemoveFile = async id => {
    const { removeFile } = this.props;
    try {
      await removeFile(id);
    } catch (e) {
      this.setState({ error: e.message });
    }
  };

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
    props({ data: { loading, error, files } }) {
      if (error) throw new Error(error);

      return { loading, files };
    }
  }),
  graphql(UPLOAD_FILES, {
    props: ({ mutate }) => ({
      uploadFiles: async files => {
        const {
          data: { uploadFiles }
        } = await mutate({
          variables: { files },
          refetchQueries: [{ query: FILES_QUERY }]
        });
        return uploadFiles;
      }
    })
  }),
  graphql(REMOVE_FILE, {
    props: ({ mutate }) => ({
      removeFile: async id => {
        const {
          data: { removeFile }
        } = await mutate({
          variables: { id },
          optimisticResponse: {
            __typename: 'Mutation',
            removeFile: {
              removeFile: true,
              __typename: 'File'
            }
          },
          update: store => {
            const cachedFiles = store.readQuery({ query: FILES_QUERY });

            store.writeQuery({
              query: FILES_QUERY,
              data: { files: cachedFiles.files.filter(file => file.id !== id) }
            });
          }
        });
        return removeFile;
      }
    })
  }),
  translate('upload')
)(Upload);
