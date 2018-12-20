import React from 'react';
import { graphql, compose } from 'react-apollo';
import { translate } from '@module/i18n-client-react';

import UploadView from '../components/UploadView';
import FILES_QUERY from '../graphql/FilesQuery.graphql';
import UPLOAD_FILES from '../graphql/UploadFiles.graphql';
import REMOVE_FILE from '../graphql/RemoveFile.graphql';

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

    this.setState({ error: result && result.error ? result.error : null });
  };

  handleRemoveFile = async id => {
    const { removeFile } = this.props;
    const result = await removeFile(id);

    this.setState({ error: result && result.error ? result.error : null });
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
        try {
          await mutate({
            variables: { files },
            refetchQueries: [{ query: FILES_QUERY }]
          });
        } catch (e) {
          return { error: e.graphQLErrors[0].message };
        }
      }
    })
  }),
  graphql(REMOVE_FILE, {
    props: ({ mutate }) => ({
      removeFile: async id => {
        try {
          await mutate({
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
        } catch (e) {
          return { error: e.graphQLErrors[0].message };
        }
      }
    })
  }),
  translate('upload')
)(Upload);
