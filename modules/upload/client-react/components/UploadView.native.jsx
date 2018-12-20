import React from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import { DocumentPicker, MediaLibrary, Constants, FileSystem } from 'expo';
import { ReactNativeFile } from 'apollo-upload-client';
import * as mime from 'react-native-mime-types';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, View, Button, TouchableOpacity, FlatList } from 'react-native';
import url from 'url';

import uploadConfig from '../../../../config/upload';

const {
  manifest: { bundleUrl }
} = Constants;
const { protocol, port, hostname } = url.parse(__API_URL__);
const serverUrl = `${protocol}//${hostname === 'localhost' ? url.parse(bundleUrl).hostname : hostname}${
  port ? ':' + port : ''
}`;

export default class UploadView extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    handleUploadFiles: PropTypes.func,
    files: PropTypes.array,
    handleRemoveFile: PropTypes.func
  };

  uploadFile = async () => {
    const { handleUploadFiles } = this.props;
    const { uri, name } = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: false });
    const type = mime.contentType(path.extname(name));
    if (type) {
      const imageData = new ReactNativeFile({ uri, name, type });
      await handleUploadFiles([imageData]);
    }
  };

  downloadFile = async (path, name) => {
    const { albumName } = uploadConfig;
    const { uri } = await FileSystem.downloadAsync(serverUrl + '/' + path, FileSystem.cacheDirectory + name);
    const createAsset = await MediaLibrary.createAssetAsync(uri);

    // Remove file from cache directory
    await FileSystem.deleteAsync(uri);

    const album = await MediaLibrary.getAlbumAsync(albumName);
    album
      ? await MediaLibrary.addAssetsToAlbumAsync([createAsset], album, false)
      : await MediaLibrary.createAlbumAsync(albumName, createAsset, false);
  };

  renderFileInfo = ({ item: { id, name, path } }) => {
    const { handleRemoveFile } = this.props;
    return (
      <TouchableOpacity style={styles.fileWrapper} onPress={() => this.downloadFile(path, name)}>
        <Text style={styles.text}>{name}</Text>
        <TouchableOpacity style={styles.iconWrapper} onPress={() => handleRemoveFile(id)}>
          <FontAwesome name="trash" size={20} style={{ color: '#3B5998' }} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  render() {
    const { files, t } = this.props;
    return files ? (
      <View style={styles.container}>
        <View style={styles.btnContainer}>
          <View style={styles.btn}>
            <Button title={t('btnUpload')} onPress={this.uploadFile} />
          </View>
        </View>
        <FlatList
          data={files}
          style={styles.list}
          keyExtractor={item => `${item.id}`}
          renderItem={this.renderFileInfo}
        />
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  btnContainer: {
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000'
  },
  btn: {
    width: 200,
    height: 50,
    marginTop: 20
  },
  text: {
    fontSize: 18
  },
  iconWrapper: {
    backgroundColor: 'transparent',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  fileWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#000',
    borderBottomWidth: 0.8,
    height: 50,
    paddingLeft: 7
  },
  list: {
    marginTop: 5,
    width: '100%'
  }
});
