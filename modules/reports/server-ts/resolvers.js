export default () => ({
  Query: {
    report(obj, { id }, { Report }) {
      return Report.report(id);
    }
  },
  Mutation: {},
  Subscription: {}
});
