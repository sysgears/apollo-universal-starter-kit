import PdfPrinter from 'pdfmake';
import fonts from './fonts/Roboto/';

interface StyleShape {
  fontSize?: number;
  bold?: boolean;
  italics?: boolean;
  alignment?: string;
  margin?: number[];
}

interface UserContact {
  id: number;
  name: string;
  phone: string;
  email: string;
}

interface Content {
  text?: string;
  style?: string;
  alignment?: string;
  image?: string;
  table?: Table;
  width?: number;
  height?: number;
}

interface Table {
  widths: string[];
  body: string[][];
}

export default class PDFBuilder {
  private printer: any;
  private content: Array<Content | string>;
  private styles: { [name: string]: StyleShape };

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

  public addStyle(name: string, style: StyleShape) {
    this.styles[name] = style;
  }

  public addTable(data: UserContact[], columnsWidth: string[]) {
    this.content.push({
      table: {
        widths: columnsWidth,
        body: [Object.keys(data[0]), ...data.map(item => Object.values(item))]
      }
    });
  }

  public addList(data: Array<string | number>, type = 'ul') {
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
