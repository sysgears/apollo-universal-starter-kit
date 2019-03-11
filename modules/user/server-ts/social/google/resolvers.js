export default () => ({
  UserAuth: {
    google(obj) {
      return obj;
    }
  },
  GoogleAuth: {
    googleId(obj) {
      return obj.googleId;
    },
    displayName(obj) {
      return obj.googleDisplayName;
    }
  }
});
