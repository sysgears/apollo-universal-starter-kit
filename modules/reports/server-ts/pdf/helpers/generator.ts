import { TranslationFunction } from 'i18next';
import PDFBuilder from './PDFBuilder';

interface UserContact {
  id: number;
  name: string;
  phone: string;
  email: string;
}

function createPDF(contacts: UserContact[], t: TranslationFunction) {
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

  pdf.addText(t('PdfReport:title'), 'header');
  pdf.addText(t('PdfReport:database'), 'subheader');
  pdf.addTable(contacts, Object.keys(contacts[0]).map((_, i) => (i === 0 ? 'auto' : '*')));
  pdf.addText(t('PdfReport:orderedList'), 'subheader');
  pdf.addList([5, 4, 3, 2, 1], 'ol');
  pdf.addText(t('PdfReport:unorderedList'), 'subheader');
  pdf.addList([1, 2, 3, 4, 5]);
  pdf.addText(t('PdfReport:image'), 'subheader');
  pdf.addImage(image, 150, 150);

  return pdf.getDocument();
}

export default function generator(contacts: UserContact[], t: TranslationFunction) {
  const doc = createPDF(contacts, t);
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
