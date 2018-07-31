import React from 'react';
import { Constants, FileSystem, ImagePicker } from 'expo';
import { ReactNativeFile } from 'apollo-upload-client';
import * as mime from 'react-native-mime-types';
import url from 'url';

const {
  manifest: { bundleUrl }
} = Constants;
const { protocol, port, hostname } = url.parse(__API_URL__);
const serverUrl = `${protocol}//${hostname === 'localhost' ? url.parse(bundleUrl).hostname : hostname}:${port}`;
const maxImageSize = 1000000;
const imageDir = FileSystem.cacheDirectory + 'ImagePicker/';
const imagePickerOptions = {
  allowsEditing: true,
  base64: false,
  quality: 0.75
};

const messageImage = Component => {
  return class MessageImage extends React.Component {
    static getDerivedStateFromProps(props, state) {
      const { messages } = props;
      const { messages: messagesState } = state;
      if (messages && messages.edges) {
        if (messagesState) {
          return {
            endCursor: messagesState.pageInfo.endCursor,
            messages: {
              ...messages,
              edges: messages.edges.map(message => {
                const {
                  cursor,
                  node,
                  node: { id }
                } = message;
                const currentMessage = messagesState.edges.find(
                  ({ node: { id: messageStateId } }) =>
                    id === messageStateId || (cursor === messages.pageInfo.endCursor && messageStateId === null)
                );
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
      endCursor: 0
    };

    componentDidMount() {
      this.checkImages();
    }

    componentDidUpdate() {
      this.checkImages();
    }

    checkImages() {
      const { messages, endCursor } = this.state;
      if (messages && endCursor < messages.pageInfo.endCursor) {
        this.addImageToMessage();
      }
    }

    async downloadImage(path, name) {
      const downloadImage = await FileSystem.downloadAsync(serverUrl + '/' + path, imageDir + name);
      return downloadImage.uri;
    }

    addImageToMessage = async () => {
      const {
        messages: { edges },
        endCursor
      } = this.state;
      const newMessages = edges.filter(({ cursor, node: { path } }) => path && (cursor > endCursor || !endCursor));
      if (newMessages.length) {
        const { isDirectory } = await FileSystem.getInfoAsync(imageDir);
        if (!isDirectory) await FileSystem.makeDirectoryAsync(imageDir);
        const files = await FileSystem.readDirectoryAsync(imageDir);
        newMessages.forEach(async message => {
          const {
            node: { image, path, name }
          } = message;
          if (!image) {
            const result = files.find(filename => filename === name);
            if (!result) await this.downloadImage(path, name);
            const { messages } = this.state;
            this.setState({
              endCursor: messages.pageInfo.endCursor,
              messages: {
                ...messages,
                edges: messages.edges.map(item => {
                  const {
                    cursor,
                    node,
                    node: { name }
                  } = item;
                  return cursor === message.cursor ? { ...item, node: { ...node, image: imageDir + name } } : item;
                })
              }
            });
          }
        });
      }
    };

    pickImage = async chatProps => {
      const { onSend } = chatProps;
      const image = await ImagePicker.launchImageLibraryAsync(imagePickerOptions);

      if (!image.cancelled) {
        const { size } = await FileSystem.getInfoAsync(image.uri);
        if (size <= maxImageSize) {
          const type = mime.lookup(image.uri);
          const name = this.receiveImageName(image.uri);
          const imageData = new ReactNativeFile({ uri: image.uri, type, name });
          onSend({ image: imageData });
        }
      }
    };

    receiveImageName(uri) {
      const reg = /((\w|-)*.\w*)$/;
      return uri.match(reg)[0];
    }

    render() {
      return <Component {...this.props} messages={this.state.messages} pickImage={this.pickImage} />;
    }
  };
};

export default messageImage;
