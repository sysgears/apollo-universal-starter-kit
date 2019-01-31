import generator from './helpers/generator';

export default () => ({
  Query: {
    async pdf(obj: any, arg: any, { Report, req }: any) {
      const report = await Report.report();
      const { t } = req;
      return generator(report, t);
    }
  }
});
