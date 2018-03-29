export default () => ({
  FacebookAuth: {
    fbId(obj) {
      return obj.fbId;
    },
    displayName(obj) {
      return obj.displayName;
    }
  }
});
