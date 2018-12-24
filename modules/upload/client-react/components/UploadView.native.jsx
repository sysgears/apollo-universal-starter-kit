import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Loading, Modal } from '@module/look-client-react-native';

export default class UploadView extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    handleUploadFile: PropTypes.func.isRequired,
    handleRemoveFile: PropTypes.func.isRequired,
    files: PropTypes.array,
    downloadFile: PropTypes.func.isRequired,
    notify: PropTypes.string,
    onBackgroundPress: PropTypes.func.isRequired
  };

  renderFileInfo = ({ item: { id, name, path } }) => {
    const { handleRemoveFile, downloadFile } = this.props;
    return (
      <TouchableOpacity style={styles.fileWrapper} onPress={() => downloadFile(path, name)}>
        <Text style={styles.text}>{name}</Text>
        <TouchableOpacity style={styles.iconWrapper} onPress={() => handleRemoveFile(id)}>
          <FontAwesome name="trash" size={20} style={{ color: '#3B5998' }} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  renderModal = () => {
    const { notify, onBackgroundPress } = this.props;
    return (
      <Modal isVisible={!!notify} onBackdropPress={onBackgroundPress}>
        <View style={styles.alertTextWrapper}>
          <Text>{notify}</Text>
        </View>
      </Modal>
    );
  };

  renderActivityIndicator = () => (
    <Modal isVisible={false}>
      <View style={styles.uploading}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </Modal>
  );

  render() {
    const { files, t, loading, handleUploadFile } = this.props;

    if (loading) {
      return <Loading text={t('loading')} />;
    }

    return files ? (
      <Fragment>
        {this.renderModal()}
        {this.renderActivityIndicator()}
        <View style={styles.container}>
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.btn} onPress={handleUploadFile}>
              <Text style={styles.btnText}>{t('upload.btn')}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={files}
            style={styles.list}
            keyExtractor={item => `${item.id}`}
            renderItem={this.renderFileInfo}
          />
        </View>
      </Fragment>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  btnContainer: {
    width: '100%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000'
  },
  btn: {
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0275d8',
    borderRadius: 10
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
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
  },
  alertTextWrapper: {
    backgroundColor: '#fff',
    padding: 10
  },
  uploading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
