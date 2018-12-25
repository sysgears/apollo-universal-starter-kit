import React from 'react';
import { graphql, compose } from 'react-apollo';
import { translate } from '@module/i18n-client-react';

import FileOperations from './FileOperations';
import FILES_QUERY from '../graphql/FilesQuery.graphql';
import UPLOAD_FILES from '../graphql/UploadFiles.graphql';
import REMOVE_FILE from '../graphql/RemoveFile.graphql';
import withFilesSubscription from './withFilesSubscription';

function AddFiles(prev, files) {
  return prev.files.some(({ id }) => files.some(file => file.id === id))
    ? prev
    : { ...prev, files: [...prev.files, ...files] };
}

function DeleteFile(prev, [{ id }]) {
  return { ...prev, files: prev.files.filter(file => file.id !== id) };
}

class Upload extends React.Component {
  componentDidUpdate() {
    const { filesUpdated, updateQuery } = this.props;
    if (filesUpdated) {
      this.updateFilesState(filesUpdated, updateQuery);
    }
  }

  updateFilesState = (filesUpdated, updateQuery) => {
    const { mutation, files } = filesUpdated;
    updateQuery(prev => {
      switch (mutation) {
        case 'CREATED':
          return AddFiles(prev, files);
        case 'DELETED':
          return DeleteFile(prev, files);
        default:
          return prev;
      }
    });
  };

  render() {
    return <FileOperations {...this.props} />;
  }
}

export default compose(
  graphql(FILES_QUERY, {
    options: () => {
      return {
        fetchPolicy: 'cache-and-network'
      };
    },
    props({ data: { loading, error, files, updateQuery } }) {
      if (error) throw new Error(error);

      return { loading, files, updateQuery };
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
  translate('upload'),
  withFilesSubscription
)(Upload);
