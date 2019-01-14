import generateBufferPDF from './pdfReport/generateBufferPDF';
import generateBufferExcel from './excelReport/generateBufferExcel';

export default () => ({
  Query: {
    report(obj, { id }, { Report }) {
      return Report.report(id);
    },
    async reports(obj, arg, { Report }) {
      return await Report.reports();
    },
    async pdfReport(obj, arg, { Report }) {
      const reports = await Report.reports();
      return generateBufferPDF(reports);
    },
    async excelReport(obj, arg, { Report }) {
      const reports = await Report.reports();
      return generateBufferExcel(reports);
    }
  },
  Mutation: {},
  Subscription: {}
});
