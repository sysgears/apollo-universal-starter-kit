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
      const messages = props.messages;
      const messagesState = state.messages;

      if (messages) {
        if (messagesState.length) {
          return {
            addImage: true,
            messages: messages.map(message => {
              const currentMessage = messagesState.find(messageState => message.id === messageState.id);
              return currentMessage ? { ...message, image: currentMessage.image } : message;
            })
          };
        }
        return { messages };
      }
    }

    state = {
      messages: [],
      addImage: true
    };

    componentDidMount() {
      if (this.state.messages.length) {
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

    addImageToMessage = async () => {
      const albumName = 'StarterKit';
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      const { messages } = this.state;

      if (status === 'granted') {
        const album = await MediaLibrary.getAlbumAsync(albumName);
        const assets = album ? (await MediaLibrary.getAssetsAsync({ ...options, id: album.id })).assets : [];

        messages.forEach(async message => {
          const { messages } = this.state;
          if (message.path) {
            const result = assets.find(({ filename }) => filename === message.name);
            const image = result ? result.uri : null;
            if (!image) {
              const downloadImage = await this.downloadImage(message.path);
              await this.addImageToAlbum(downloadImage);
            }

            this.setState({
              messages: messages.map(item => {
                return item.id === message.id ? { ...item, image } : item;
              })
            });
          }
        });
      }
    };

    render() {
      return <Component {...this.props} messages={this.state.messages} />;
    }
  };
};

export default messageImage;
