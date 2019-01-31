export default () => ({
  UserAuth: {
    github(obj) {
      return obj;
    }
  },
  GithubAuth: {
    ghId(obj) {
      return obj.ghId;
    },
    displayName(obj) {
      return obj.ghDisplayName;
    }
  }
});
