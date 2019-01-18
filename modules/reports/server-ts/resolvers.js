export default () => ({
  Query: {
    async report(obj, arg, { Report }) {
      return await Report.report();
    }
  }
});
