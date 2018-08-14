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

const imageDir = FileSystem.cacheDirectory + 'ImagePicker/';

const messageImage = Component => {
  return class MessageImage extends React.Component {
    static propTypes = {
      messages: PropTypes.object,
      t: PropTypes.func
    };

    static getDerivedStateFromProps(props, state) {
      const { messages } = props;
      const { images, stateEdges } = state;
      if (images && messages) {
        if (!stateEdges) {
          return { stateEdges: messages.edges };
        }
        const addImageToNode = (node, { node: currentNode }) => {
          const quotedMessage = { ...node.quotedMessage, image: currentNode.quotedMessage.image };
          return { ...node, image: currentNode.image, quotedMessage };
        };

        return {
          stateEdges: messages.edges.map(({ node, cursor }) => {
            const currentEdge = stateEdges.find(({ node: { id } }) => node.id === id || !id);
            return currentEdge ? { node: addImageToNode(node, currentEdge), cursor } : { node, cursor };
          })
        };
      }
      return null;
    }

    state = {
      stateEdges: null,
      stateEndCursor: null,
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
      const { stateEdges, stateEndCursor } = this.state;
      if (stateEdges && stateEndCursor < this.props.messages.pageInfo.endCursor) {
        const newEdges = stateEdges.filter(
          ({ cursor, node }) => (node.path || node.quotedMessage.path) && (cursor > stateEndCursor || !stateEndCursor)
        );
        if (newEdges.length) this.addImageToMessage(newEdges);
      }
    };

    downloadImage = async (path, filename) =>
      await FileSystem.downloadAsync(serverUrl + '/' + path, imageDir + filename).uri;

    addImageToMessage = async newMessages => {
      const { getInfoAsync, makeDirectoryAsync, readDirectoryAsync } = FileSystem;
      const { isDirectory } = await getInfoAsync(imageDir);
      if (!isDirectory) await makeDirectoryAsync(imageDir);
      const files = await readDirectoryAsync(imageDir);
      await newMessages.forEach(async ({ cursor, node }) => {
        await [node, node.quotedMessage].forEach(({ filename, path }) => {
          if (filename && path && !files.includes(filename)) {
            this.downloadImage(path, filename);
          }
        });
        const { stateEdges } = this.state;
        this.setState({
          stateEndCursor: this.props.messages.pageInfo.endCursor,
          stateEdges: stateEdges.map(edge => {
            const { cursor: edgeCursor, node } = edge;
            if (edgeCursor === cursor) {
              const { quotedMessage: quoted, filename } = node;
              const quotedMessage = { ...quoted, image: quoted.filename ? `${imageDir}${quoted.filename}` : null };
              return { ...edge, node: { ...node, quotedMessage, image: filename ? `${imageDir}${filename}` : null } };
            } else {
              return edge;
            }
          })
        });
      });
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

    pickImage = async ({ onSend }) => {
      const { t } = this.props;
      const permission = Platform.OS === 'ios' ? await this.checkPermission(Permissions.CAMERA_ROLL) : true;
      if (permission) {
        const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync(chatConfig.image.imagePicker);
        if (!cancelled) {
          const { size } = await FileSystem.getInfoAsync(uri);
          const reg = /[^\\/]*\.\w+$/;
          if (size <= chatConfig.image.maxSize && reg.test(uri)) {
            const type = mime.lookup(uri);
            const name = uri.match(reg)[0];
            const imageData = new ReactNativeFile({ uri, type, name });
            onSend({ attachment: imageData });
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
      const { images, stateEdges } = this.state;
      const { messages } = this.props;
      const newProps = {
        images,
        messages: stateEdges ? { ...messages, edges: stateEdges } : messages,
        pickImage: this.pickImage
      };

      return (
        <View style={{ flex: 1 }}>
          <Component {...this.props} {...newProps} />
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
