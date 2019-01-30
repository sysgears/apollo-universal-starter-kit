export default () => ({
  Mutation: {
    logout: async (obj, args, { req }) => {
      req.universalCookies.remove('session');
    }
  }
});
