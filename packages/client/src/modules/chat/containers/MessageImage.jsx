import React from 'react';
import { FileSystem, ImagePicker } from 'expo';
import { ReactNativeFile } from 'apollo-upload-client';
import * as mime from 'react-native-mime-types';

const maxImageSize = 1000000;
const imagePickerOptions = {
  allowsEditing: true,
  base64: false,
  quality: 0.75
};

const messageImage = Component => {
  return class MessageImage extends React.Component {
    static getDerivedStateFromProps(props, state) {
      const messages = props.messages;
      const messagesState = state.messages;

      if (messages && messages.edges) {
        if (messagesState) {
          return {
            addImage: true,
            messages: {
              ...messages,
              edges: messages.edges.map(message => {
                const currentMessage = messagesState.edges.find(
                  messageState => message.node.id === messageState.node.id
                );
                return currentMessage
                  ? {
                      ...message,
                      node: { ...message.node, image: currentMessage.node.image }
                    }
                  : message;
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
      addImage: true
    };

    componentDidMount() {
      if (this.state.messages) {
        this.setState({ addImage: false });
        this.addImageToMessage();
      }
    }

    componentDidUpdate() {
      if (this.state.messages && this.state.addImage) {
        this.setState({ addImage: false });
        this.addImageToMessage();
      }
    }

    async downloadImage(path, name) {
      const uri = 'http://192.168.0.146:8080/' + path;
      const downloadImage = await FileSystem.downloadAsync(uri, FileSystem.cacheDirectory + name);
      return downloadImage.uri;
    }

    addImageToMessage = async () => {
      const files = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory);
      this.state.messages.edges.forEach(async message => {
        if (!message.node.image && message.node.path) {
          const result = files.find(filename => filename === message.node.name);
          if (!result) await this.downloadImage(message.node.path, message.node.name);
          this.setState({
            messages: {
              ...this.state.messages,
              edges: this.state.messages.edges.map(item => {
                return item.node.id === message.node.id
                  ? {
                      ...item,
                      node: { ...item.node, image: FileSystem.cacheDirectory + item.node.name }
                    }
                  : item;
              })
            }
          });
        }
      });
    };

    pickImage = async props => {
      const { onSend } = props;
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
