import generateExcel from './helpers/generateExcel';

export default () => ({
  Query: {
    async excel(obj, arg, { Report }) {
      const report = await Report.report();
      return generateExcel(report);
    }
  }
});
