import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import { compose } from '@gqlapp/core-common';
import { translate } from '@gqlapp/i18n-client-react';

import UploadView from '../components/UploadView';
import FILES_QUERY from '../graphql/FilesQuery.graphql';
import UPLOAD_FILES from '../graphql/UploadFiles.graphql';
import REMOVE_FILE from '../graphql/RemoveFile.graphql';

const Upload = props => {
  const { uploadFiles, removeFile } = props;
  const [error, setError] = useState(null);

  const handleUploadFiles = async files => {
    try {
      await uploadFiles(files);
    } catch (e) {
      setError({ error: e.message });
    }
  };

  const handleRemoveFile = async id => {
    try {
      await removeFile(id);
    } catch (e) {
      setError({ error: e.message });
    }
  };

  return (
    <UploadView {...props} error={error} handleRemoveFile={handleRemoveFile} handleUploadFiles={handleUploadFiles} />
  );
};

Upload.propTypes = {
  uploadFiles: PropTypes.func,
  removeFile: PropTypes.func
};

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
