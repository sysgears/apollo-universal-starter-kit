export default () => ({
  UserAuth: {
    facebook(obj) {
      return obj;
    }
  },
  FacebookAuth: {
    fbId(obj) {
      return obj.fbId;
    },
    displayName(obj) {
      return obj.fbDisplayName;
    }
  }
});
