export default () => ({
  Query: {
    posts(obj, args, { Report }) {
      return Report.posts();
    }
  },
  Mutation: {},
  Subscription: {}
});
