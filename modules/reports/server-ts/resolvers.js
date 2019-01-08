export default () => ({
  Query: {
    report(obj, { id }, { Report }) {
      return Report.report(id);
    },
    async reports(obj, arg, { Report }) {
      return await Report.reports();
    }
  },
  Mutation: {},
  Subscription: {}
});
