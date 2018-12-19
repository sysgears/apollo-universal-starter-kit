import React from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import { DocumentPicker } from 'expo';
import { ReactNativeFile } from 'apollo-upload-client';
import * as mime from 'react-native-mime-types';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, View, Button, TouchableOpacity, FlatList } from 'react-native';

const UploadView = ({ t, handleUploadFiles, files, handleRemoveFile }) => {
  const uploadFile = async () => {
    const { uri, name } = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: false });
    const type = mime.contentType(path.extname(name));
    if (type) {
      const imageData = new ReactNativeFile({ uri, name, type });
      await handleUploadFiles([imageData]);
    }
  };

  const renderFileInfo = ({ item: { id, name } }) => {
    return (
      <TouchableOpacity style={styles.fileWrapper}>
        <Text style={styles.text}>{name}</Text>
        <TouchableOpacity style={styles.iconWrapper} onPress={() => handleRemoveFile(id)}>
          <FontAwesome name="trash" size={20} style={{ color: '#3B5998' }} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  renderFileInfo.propTypes = {
    item: PropTypes.object
  };

  return files ? (
    <View style={styles.container}>
      <View style={styles.btnContainer}>
        <View style={styles.btn}>
          <Button title={t('btnUpload')} onPress={uploadFile} />
        </View>
      </View>
      <FlatList data={files} style={styles.list} keyExtractor={item => `${item.id}`} renderItem={renderFileInfo} />
    </View>
  ) : null;
};

UploadView.propTypes = {
  t: PropTypes.func,
  handleUploadFiles: PropTypes.func,
  files: PropTypes.array,
  handleRemoveFile: PropTypes.func
};

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

export default UploadView;
