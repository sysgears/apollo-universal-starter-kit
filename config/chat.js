export default {
  limit: 2,
  images: true,
  giftedChat: {
    alwaysShowSend: false,
    timeFormat: 'LT',
    dateFormat: 'll',
    isAnimated: true,
    showUserAvatar: false,
    showAvatarForEveryMessage: true,
    renderAvatarOnTop: false,
    inverted: true,
    keyboardShouldPersistTaps: 'never'
  },
  image: {
    dirName: 'ImagePicker',
    maxSize: 1000000,
    imagePicker: {
      allowsEditing: true,
      base64: false,
      quality: 0.75
    }
  }
};
