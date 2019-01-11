import PdfPrinter from 'pdfmake';
import path from 'path';

import docDefinition from './docDefinition';

const fonts = {
  Roboto: {
    normal: path.join(__dirname, '/fonts/Roboto-Regular.ttf'),
    bold: path.join(__dirname, '/fonts/Roboto-Medium.ttf'),
    italics: path.join(__dirname, '/fonts/Roboto-Italic.ttf'),
    bolditalics: path.join(__dirname, 'fonts/Roboto-MediumItalic.ttf')
  }
};

export default function generateBufferPDF() {
  const printer = new PdfPrinter(fonts);
  const doc = printer.createPdfKitDocument(docDefinition);
  const chunks = [];

  doc.on('data', chunk => {
    chunks.push(chunk);
  });

  const buffer = new Promise(res => {
    doc.on('end', () => {
      res(Buffer.concat(chunks));
    });
  });

  doc.end();

  return buffer;
}
