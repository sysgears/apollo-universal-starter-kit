export default {
  limit: 50,
  allowImages: true,
  uploadDir: 'public',
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
    maxSize: 1048576,
    imagePicker: {
      allowsEditing: true,
      base64: false,
      quality: 0.75
    }
  }
};
