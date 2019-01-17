import generatePDF from './pdfReport/generatePDF';
import generateBufferExcel from './excelReport/generateBufferExcel';

export default () => ({
  Query: {
    async report(obj, arg, { Report }) {
      return await Report.report();
    },
    async pdf(obj, arg, { Report }) {
      const report = await Report.report();
      return generatePDF(report);
    },
    async excel(obj, arg, { Report }) {
      const report = await Report.report();
      return generateBufferExcel(report);
    }
  },
  Mutation: {},
  Subscription: {}
});
