import PdfPrinter from 'pdfmake';
import path from 'path';

function createTable(array) {
  const titles = Object.keys(array[0]);
  const capitilizedTitles = titles.map(title => title[0].toUpperCase() + title.slice(1));
  const columnAmount = titles.length;
  const columnWidths = [...Array(columnAmount).keys()].map(i => (i === 0 ? 'auto' : '*'));
  const docDefinition = {
    content: [
      {
        table: {
          widths: columnWidths,
          body: []
        }
      }
    ]
  };
  const tableBody = docDefinition.content[0].table.body;

  tableBody.push(capitilizedTitles);

  array.forEach(element => {
    const values = Object.values(element);
    tableBody.push(values);
  });

  return docDefinition;
}

const fonts = {
  Roboto: {
    normal: path.join(__dirname, '/fonts/Roboto-Regular.ttf'),
    bold: path.join(__dirname, '/fonts/Roboto-Medium.ttf'),
    italics: path.join(__dirname, '/fonts/Roboto-Italic.ttf'),
    bolditalics: path.join(__dirname, 'fonts/Roboto-MediumItalic.ttf')
  }
};

export default function generateBufferPDF(reports) {
  const printer = new PdfPrinter(fonts);
  const docDefinition = createTable(reports);
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
