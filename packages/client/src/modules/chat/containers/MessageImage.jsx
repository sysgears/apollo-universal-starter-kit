import React from 'react';
import { Constants, FileSystem, ImagePicker, Permissions } from 'expo';
import { ReactNativeFile } from 'apollo-upload-client';
import * as mime from 'react-native-mime-types';
import url from 'url';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Platform } from 'react-native';

import { Modal } from '../../common/components/native';
import chatConfig from '../../../../../../config/chat';

const {
  manifest: { bundleUrl }
} = Constants;
const { protocol, port, hostname } = url.parse(__API_URL__);
const serverUrl = `${protocol}//${hostname === 'localhost' ? url.parse(bundleUrl).hostname : hostname}${
  port ? ':' + port : ''
}`;

const imageDir = FileSystem.cacheDirectory + chatConfig.image.dirName + '/';

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
      images: chatConfig.images,
      notify: null
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

    checkPermission = async type => {
      const { status } = await Permissions.getAsync(type);
      return status !== 'granted' ? await Permissions.askAsync(type).status : status;
    };

    pickImage = async ({ onSend }) => {
      const { t } = this.props;
      const permission = Platform.OS === 'ios' ? await this.checkPermission(Permissions.CAMERA_ROLL) : 'granted';
      if (permission === 'granted') {
        const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync(chatConfig.image.imagePicker);
        if (!cancelled) {
          const { size } = await FileSystem.getInfoAsync(uri);
          const reg = /[^\\/]*\.\w+$/;
          if (size <= chatConfig.image.maxSize && reg.test(uri)) {
            const type = mime.lookup(uri);
            const name = uri.match(reg)[0];
            const imageData = new ReactNativeFile({ uri, type, name });
            onSend({ image: imageData });
          } else {
            this.setState({ notify: t('attachment.errorMsg') });
          }
        }
      } else {
        this.setState({ notify: t('permission.errorMsg') });
      }
    };

    renderModal = () => {
      const { notify } = this.state;
      if (notify) {
        return (
          <Modal isVisible={!!notify} onBackdropPress={() => this.setState({ notify: null })}>
            <View style={styles.alertTextWrapper}>
              <Text>{notify}</Text>
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
