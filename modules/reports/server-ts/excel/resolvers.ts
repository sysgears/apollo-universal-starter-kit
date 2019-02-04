import generateExcel from './helpers/generateExcel';

export default () => ({
  Query: {
    async excel(obj: any, arg: any, { Report }: any) {
      const report = await Report.report();
      return generateExcel(report);
    }
  }
});
