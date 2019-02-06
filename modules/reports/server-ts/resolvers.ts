export default () => ({
  Query: {
    async report(obj: any, arg: any, { Report }: any) {
      return Report.report();
    }
  }
});
