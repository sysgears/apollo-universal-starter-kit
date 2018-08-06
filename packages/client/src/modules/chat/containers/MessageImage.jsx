import React from 'react';
import { Constants, FileSystem, ImagePicker } from 'expo';
import { ReactNativeFile } from 'apollo-upload-client';
import * as mime from 'react-native-mime-types';
import url from 'url';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

import { Modal } from '../../common/components/native';

const {
  manifest: { bundleUrl }
} = Constants;
const { protocol, port, hostname } = url.parse(__API_URL__);
const serverUrl = `${protocol}//${hostname === 'localhost' ? url.parse(bundleUrl).hostname : hostname}${
  port ? ':' + port : ''
}`;
const maxImageSize = 1000000;
const imageDir = FileSystem.cacheDirectory + 'ImagePicker/';
const imagePickerOptions = {
  allowsEditing: true,
  base64: false,
  quality: 0.75
};

const messageImage = Component => {
  return class MessageImage extends React.Component {
    static propTypes = {
      messages: PropTypes.object,
      t: PropTypes.func
    };

    static getDerivedStateFromProps(props, state) {
      const { messages } = props;
      const { images, messages: messagesState } = state;
      if (images && messages && messages.edges) {
        if (messagesState) {
          return {
            endCursor: messagesState.pageInfo.endCursor,
            messages: {
              ...messages,
              edges: messages.edges.map(message => {
                const { node } = message;
                const currentMessage = messagesState.edges.find(({ node: { id } }) => node.id === id || id === null);
                return currentMessage ? { ...message, node: { ...node, image: currentMessage.node.image } } : message;
              })
            }
          };
        } else {
          return { messages };
        }
      }
      return null;
    }

    state = {
      messages: null,
      endCursor: 0,
      images: true,
      showModal: false
    };

    componentDidMount() {
      this.checkImages();
    }

    componentDidUpdate() {
      this.checkImages();
    }

    checkImages = () => {
      const { messages, endCursor } = this.state;
      if (messages && endCursor < messages.pageInfo.endCursor) {
        const newMsg = messages.edges.filter(({ cursor, node }) => node.path && (cursor > endCursor || !endCursor));
        if (newMsg.length) this.addImageToMessage(newMsg);
      }
    };

    downloadImage = async (path, name) => await FileSystem.downloadAsync(serverUrl + '/' + path, imageDir + name).uri;

    addImageToMessage = async newMsg => {
      const { isDirectory } = await FileSystem.getInfoAsync(imageDir);
      if (!isDirectory) await FileSystem.makeDirectoryAsync(imageDir);
      const files = await FileSystem.readDirectoryAsync(imageDir);
      newMsg.forEach(async ({ cursor, node }) => {
        const result = files.find(filename => filename === node.name);
        if (!result) await this.downloadImage(node.path, node.name);
        const { messages } = this.state;
        this.setState({
          endCursor: messages.pageInfo.endCursor,
          messages: {
            ...messages,
            edges: messages.edges.map(item => {
              const { cursor: itemCursor, node } = item;
              return itemCursor === cursor ? { ...item, node: { ...node, image: imageDir + node.name } } : item;
            })
          }
        });
      });
    };

    pickImage = async ({ onSend }) => {
      const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync(imagePickerOptions);
      if (!cancelled) {
        const { size } = await FileSystem.getInfoAsync(uri);
        if (size <= maxImageSize) {
          const type = mime.lookup(uri);
          const reg = /[^\\/]*\.\w+$/;
          if (reg.test(uri)) {
            const name = uri.match(reg)[0];
            const imageData = new ReactNativeFile({ uri, type, name });
            onSend({ image: imageData });
          }
        } else {
          this.setState({ showModal: true });
        }
      }
    };

    renderModal = () => {
      const { t } = this.props;
      const { showModal } = this.state;
      if (showModal) {
        return (
          <Modal isVisible={showModal} onBackdropPress={() => this.setState({ showModal: false })}>
            <View style={styles.alertTextWrapper}>
              <Text>{t('attachment.errorMsg')}</Text>
            </View>
          </Modal>
        );
      }
    };

    render() {
      const { images } = this.state;
      const props = {
        ...this.props,
        images,
        messages: images ? this.state.messages : this.props.messages,
        pickImage: this.pickImage
      };

      return (
        <View style={{ flex: 1 }}>
          <Component {...props} />
          {this.renderModal()}
        </View>
      );
    }
  };
};

const styles = StyleSheet.create({
  alertTextWrapper: {
    backgroundColor: '#fff',
    padding: 10
  }
});

export default messageImage;
