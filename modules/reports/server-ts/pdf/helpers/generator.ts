import PDFBuilder from './PDFBuilder';

function createPDF(reports: object[]) {
  const pdf = new PDFBuilder();
  const image = `${__dirname}/app.png`;

  pdf.addStyle('header', {
    fontSize: 18,
    bold: true,
    margin: [0, 0, 0, 10]
  });

  pdf.addStyle('subheader', {
    fontSize: 16,
    bold: true,
    margin: [0, 10, 0, 5]
  });

  pdf.addText('This is title of the report', 'header');
  pdf.addText('You can create table with data from database', 'subheader');
  pdf.addTable(reports, Object.keys(reports[0]).map((_, i) => (i === 0 ? 'auto' : '*')));
  pdf.addText('Here is example of ordered list', 'subheader');
  pdf.addList([5, 4, 3, 2, 1], 'ol');
  pdf.addText('And unordered list', 'subheader');
  pdf.addList([1, 2, 3, 4, 5]);
  pdf.addText('To add an image you have to provide path to an image, width and height', 'subheader');
  pdf.addImage(image, 150, 150);

  return pdf.getDocument();
}

export default function generator(reports: object[]) {
  const doc = createPDF(reports);
  const chunks: Uint8Array[] = [];

  doc.on('data', (chunk: Uint8Array) => {
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
