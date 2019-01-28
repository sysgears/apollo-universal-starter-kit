import generator from './helpers/generator';

export default () => ({
  Query: {
    async pdf(obj: any, arg: any, { Report }: any) {
      const report = await Report.report();
      return generator(report);
    }
  }
});
