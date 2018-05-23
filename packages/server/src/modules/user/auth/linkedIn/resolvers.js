export default () => ({
  UserAuth: {
    linkedin(obj) {
      return obj;
    }
  },
  LinkedInAuth: {
    lnId(obj) {
      return obj.lnId;
    },
    displayName(obj) {
      return obj.lnDisplayName;
    }
  }
});
