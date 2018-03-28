import { ApolloError } from 'apollo-client';
import { graphql, OptionProps } from 'react-apollo';

import FILES_QUERY from './FilesQuery.graphql';
import UPLOAD_FILES from './UploadFiles.graphql';
import REMOVE_FILE from './RemoveFile.graphql';

import { UploadOption, UploadQueryResult } from '../types';

const withFiles = (Component: any) =>
  graphql(FILES_QUERY, {
    options: () => {
      return {
        fetchPolicy: 'cache-and-network'
      };
    },
    props({ data: { loading, error, files, refetch } }: OptionProps<any, UploadQueryResult>) {
      if (error) {
      }
      return { loading, files, refetch };
    }
  })(Component);

const withFilesUploading = (Component: any) =>
  graphql(UPLOAD_FILES, {
    props: ({ ownProps: { refetch }, mutate }: OptionProps<any, UploadOption>) => ({
      uploadFiles: async (files: any) => {
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
  })(Component);

const withFilesRemoving = (Component: any) =>
  graphql(REMOVE_FILE, {
    props: ({ ownProps: { refetch }, mutate }: OptionProps<any, UploadOption>) => ({
      removeFile: async (id: number) => {
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
  })(Component);

export { withFiles, withFilesUploading, withFilesRemoving };
