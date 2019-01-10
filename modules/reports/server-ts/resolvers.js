export default () => ({
  Query: {
    report(obj, { id }, { Report }) {
      return Report.report(id);
    },
    async reports(obj, arg, { Report }) {
      return await Report.reports();
    },
    async getReport() {
      // const path = require('path');

      // const fonts = {
      //   Roboto: {
      //     normal: path.join(__dirname, '/fonts/Roboto-Regular.ttf'),
      //     bold: path.join(__dirname, '/fonts/Roboto-Bold.ttf'),
      //     italics: path.join(__dirname, '/fonts/Roboto-Italic.ttf')
      //   }
      // };

      const pdfMake = require('pdfmake/build/pdfmake.js');
      const pdfFonts = require('pdfmake/build/vfs_fonts.js');
      pdfMake.vfs = pdfFonts.pdfMake.vfs;

      const docDefinition = {
        content: [
          'First paragraph',
          'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
        ]
      };

      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      // const bufferTest = await pdfDocGenerator.getBuffer();

      const blobTest = await new Promise(res => {
        pdfDocGenerator.getBlob(blob => {
          console.log('blob', blob);
          res(blob);
        });
      });
      console.log('blobTest', blobTest);
      return blobTest;
      // return await pdfDocGenerator.getBuffer(async (buffer) => {
      //   console.log('buffer', buffer);
      //   return buffer
      // });

      // console.log('bufferTest', bufferTest);
      // return bufferTest;

      // const pdfDoc = printer.createPdfKitDocument(docDefinition);
      // console.log('pdfDoc', pdfDoc)
      // // pdfDoc.pipe(fs.createWriteStream('document.pdf'));
      // pdfDoc.end();
    }
  },
  Mutation: {},
  Subscription: {}
});
