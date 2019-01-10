import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default () => ({
  Query: {
    report(obj, { id }, { Report }) {
      return Report.report(id);
    },
    async reports(obj, arg, { Report }) {
      return await Report.reports();
    },
    async getReport() {
      const docDefinition = {
        content: [
          'First paragraph',
          'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
        ]
      };
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);

      return await new Promise(res => {
        pdfDocGenerator.getBuffer(buffer => {
          res(buffer);
        });
      });
    }
  },
  Mutation: {},
  Subscription: {}
});
