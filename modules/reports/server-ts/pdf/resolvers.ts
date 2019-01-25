import generatePDF from './helpers/generatePDF';

export default () => ({
  Query: {
    async pdf(obj: any, arg: any, { Report }: any) {
      const report = await Report.report();
      return generatePDF(report);
    }
  }
});
