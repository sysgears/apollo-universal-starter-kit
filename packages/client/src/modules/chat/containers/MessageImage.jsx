import React from 'react';
import { MediaLibrary, Permissions, FileSystem } from 'expo';

Permissions.askAsync(Permissions.CAMERA_ROLL);

const options = {
  first: 1000,
  sortBy: [MediaLibrary.SortBy.default],
  mediaType: [MediaLibrary.MediaType.photo]
};

const messageImage = Component => {
  return class MessageImage extends React.Component {
    static getDerivedStateFromProps(props, state) {
      if (props.messages) {
        const messages = props.messages;
        const messagesState = state.messages;
        if (messages) {
          if (messagesState && messagesState.edges.length) {
            return {
              addImage: true,
              messages: {
                ...messages,
                edges: messages.edges.map(message => {
                  const currentMessage = messagesState.edges.find(messageState => message.id === messageState.id);
                  return currentMessage ? { ...message, image: currentMessage.image } : message;
                })
              }
            };
          }
          return { messages };
        }
        return null;
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
      if (this.state.addImage) {
        this.setState({ addImage: false });
        this.addImageToMessage();
      }
    }

    async addImageToAlbum(localFile) {
      const albumName = 'StarterKit';
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status === 'granted') {
        const asset = await MediaLibrary.createAssetAsync(localFile);
        const album = await MediaLibrary.getAlbumAsync(albumName);
        if (album) {
          return await MediaLibrary.addAssetsToAlbumAsync(asset, album.id, false);
        } else {
          await MediaLibrary.createAlbumAsync(albumName, asset);
          return MediaLibrary.removeAssetsFromAlbumAsync(asset, asset.albumId);
        }
      }
    }

    async downloadImage(path) {
      const uri = 'http://192.168.0.146:8080/' + path;
      const downloadImage = await FileSystem.downloadAsync(uri, FileSystem.cacheDirectory + 'photo.jpg');
      return downloadImage.uri;
    }

    getAssets = async albumName => {
      const album = await MediaLibrary.getAlbumAsync(albumName);
      return album ? (await MediaLibrary.getAssetsAsync({ ...options, id: album.id })).assets : [];
    };

    findImage = (assets, imageName) => {
      const result = assets.find(({ filename }) => filename === imageName);
      return result ? result.uri : null;
    };

    addImageToMessage = async () => {
      const albumName = 'StarterKit';
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status === 'granted') {
        const assets = await this.getAssets(albumName);

        this.state.messages.edges.forEach(async message => {
          let image = this.findImage(assets, message.node.name);
          if (!image && message.node.path) {
            const downloadImage = await this.downloadImage(message.node.path);
            await this.addImageToAlbum(downloadImage);
            const assets = await this.getAssets(albumName);
            image = this.findImage(assets, message.node.name);
          }

          this.setState({
            messages: {
              ...this.state.messages,
              edges: this.state.messages.edges.map(item => {
                return item.node.id === message.node.id ? { ...item, node: { ...item.node, image } } : item;
              })
            }
          });
        });
      }
    };

    render() {
      return <Component {...this.props} messages={this.state.messages} />;
    }
  };
};

export default messageImage;
