import generatePDF from './pdfReport/generatePDF';
import generateBufferExcel from './excelReport/generateBufferExcel';

export default () => ({
  Query: {
    async report(obj, arg, { Report }) {
      return await Report.report();
    },
    async pdf(obj, arg, { Report }) {
      const reports = await Report.reports();
      return generatePDF(reports);
    },
    async excel(obj, arg, { Report }) {
      const reports = await Report.reports();
      return generateBufferExcel(reports);
    }
  },
  Mutation: {},
  Subscription: {}
});
