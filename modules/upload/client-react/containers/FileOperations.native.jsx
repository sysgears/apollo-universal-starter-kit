import React from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import { DocumentPicker, MediaLibrary, ImagePicker, Constants, FileSystem, Permissions } from 'expo';
import { compose } from 'react-apollo';
import { Alert } from 'react-native';
import { ReactNativeFile } from 'apollo-upload-client';
import * as mime from 'react-native-mime-types';
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';
import url from 'url';

import uploadConfig from '../../../../config/upload';
import UploadView from '../components/UploadView';
import chatConfig from '../../../../config/chat';

const {
  manifest: { bundleUrl }
} = Constants;
const { protocol, host, hostname, port } = url.parse(__API_URL__);
const serverUrl = `${protocol}//${
  hostname === 'localhost' ? url.parse(bundleUrl).hostname + (port ? ':' + port : '') : host
}`;

const withActionSheetProvider = Component => {
  const ActionSheet = props => {
    return (
      <ActionSheetProvider>
        <Component {...props} />
      </ActionSheetProvider>
    );
  };
  return ActionSheet;
};

class FileOperations extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired
  };

  state = {
    downloadingFiles: []
  };

  handleRemoveFile = async id => {
    const { removeFile } = this.props;
    const result = await removeFile(id);
    if (result && result.error) {
      Alert.alert(result.error);
    }
  };

  handleUploadFile = async () => {
    const { showActionSheetWithOptions, t } = this.props;
    const options = [t('upload.media'), t('upload.documents'), t('upload.cancel')];

    showActionSheetWithOptions({ options, cancelButtonIndex: 2 }, async buttonIndex => {
      switch (buttonIndex) {
        case 0:
          if (this.checkPermission(Permissions.CAMERA_ROLL)) {
            const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync(chatConfig.image.imagePicker);
            if (!cancelled) {
              const name = uri.match(/[^\\/]*\.\w+$/)[0];
              this.uploadFile({ uri, name });
            }
          }
          break;

        case 1:
          this.uploadFile(await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: false }));
          break;
      }
    });
  };

  uploadFile = async ({ uri, name, type: pickerType }) => {
    const { uploadFiles, t } = this.props;
    if (pickerType === 'cancel') {
      return;
    }

    const type = mime.contentType(path.extname(name));
    if (type) {
      const imageData = new ReactNativeFile({ uri, name, type });
      const result = await uploadFiles([imageData]);
      if (result && result.error) {
        Alert.alert(result.error);
      }
    } else {
      Alert.alert(t('upload.errorMsg'));
    }
  };

  handleDownloadFile = async (path, name, id) => {
    const { t } = this.props;

    this.setState({ downloadingFiles: [...this.state.downloadingFiles, id] });
    (await this.checkPermission(Permissions.CAMERA_ROLL))
      ? await this.downloadFile(path, name)
      : Alert.alert(t('download.errorMsg'));
    this.setState({ downloadingFiles: this.state.downloadingFiles.filter(fileId => fileId !== id) });
  };

  downloadFile = async (path, name) => {
    const { t } = this.props;
    const { albumName } = uploadConfig;
    const { getAlbumAsync, addAssetsToAlbumAsync, createAlbumAsync, createAssetAsync } = MediaLibrary;
    const { downloadAsync, deleteAsync, cacheDirectory } = FileSystem;
    try {
      const { uri } = await downloadAsync(serverUrl + '/' + path, cacheDirectory + name);
      const createAsset = await createAssetAsync(uri);

      // Remove file from cache directory
      await deleteAsync(uri);

      const album = await getAlbumAsync(albumName);
      album
        ? await addAssetsToAlbumAsync([createAsset], album, false)
        : await createAlbumAsync(albumName, createAsset, false);
      Alert.alert(t('download.successMsg'));
    } catch (e) {
      Alert.alert(e);
    }
  };

  checkPermission = async type => {
    const { getAsync, askAsync } = Permissions;
    const { status } = await getAsync(type);
    if (status !== 'granted') {
      const { status } = await askAsync(type);
      return status === 'granted';
    }
    return true;
  };

  render() {
    return (
      <UploadView
        {...this.props}
        handleRemoveFile={this.handleRemoveFile}
        handleUploadFile={this.handleUploadFile}
        handleDownloadFile={this.handleDownloadFile}
        onBackgroundPress={() => this.setState({ notify: null })}
        downloadingFiles={this.state.downloadingFiles}
      />
    );
  }
}

export default compose(
  withActionSheetProvider,
  connectActionSheet
)(FileOperations);
