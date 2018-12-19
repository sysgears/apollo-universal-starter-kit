import React from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import { DocumentPicker } from 'expo';
import { ReactNativeFile } from 'apollo-upload-client';
import * as mime from 'react-native-mime-types';
import { StyleSheet, Text, View, Button } from 'react-native';

const UploadView = ({ t, handleUploadFiles }) => {
  const uploadFile = async () => {
    const { uri, name } = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: false });
    const type = mime.contentType(path.extname(name));
    if (type) {
      const imageData = new ReactNativeFile({ uri, name, type });
      await handleUploadFiles([imageData]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.element}>
        <Button title="Upload" onPress={uploadFile} />
        <Text style={styles.box}>{t('nativeMock')}</Text>
      </View>
    </View>
  );
};

UploadView.propTypes = {
  t: PropTypes.func,
  handleUploadFiles: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  element: {
    paddingTop: 30
  },
  box: {
    textAlign: 'center',
    marginLeft: 15,
    marginRight: 15
  }
});

export default UploadView;
