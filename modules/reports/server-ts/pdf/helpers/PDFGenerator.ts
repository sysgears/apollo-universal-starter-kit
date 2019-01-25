import PdfPrinter from 'pdfmake';
import fonts from './fonts/Roboto/';

class PDFGenerator {
  private printer: any;
  private content: object[];
  private styles: object;

  constructor() {
    this.printer = new PdfPrinter(fonts);
    this.content = [];
    this.styles = {};
  }

  public addText(text: string, style?: string, alignment?: string) {
    this.content.push({
      text,
      style,
      alignment
    });
  }

  public addStyle(name: string, style: object) {
    this.styles[name] = style;
  }

  public addTable(data: object[], columnsWidth: object) {
    this.content.push({
      table: {
        widths: columnsWidth,
        body: [Object.keys(data[0]), ...data.map(item => Object.values(item))]
      }
    });
  }

  public addList(data: any[], type = 'ul') {
    this.content.push({
      [type]: data
    });
  }

  public addImage(image: string, width: number, height: number) {
    this.content.push({
      image,
      width,
      height
    });
  }

  public getDocument() {
    return this.printer.createPdfKitDocument({
      content: this.content,
      styles: this.styles
    });
  }
}

export default PDFGenerator;
