import generatePDF from './helpers/generatePDF';

export default () => ({
  Query: {
    async pdf(obj, arg, { Report }) {
      const report = await Report.report();
      return generatePDF(report);
    }
  }
});
