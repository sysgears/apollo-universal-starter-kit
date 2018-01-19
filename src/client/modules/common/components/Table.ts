import { ButtonSize } from './Button';

export interface CellData {
  type: ElemType;
  text: any;
  link?: string;
  className?: string;
  callback?: any;
}

export interface ColumnData {
  title: string;
  value?: string;
  width?: number;
  iconRender?: any;
  sorting?: any;
  columnSpan?: number;
}

export enum ElemType {
  Link = 0,
  Button = 1,
  Text = 2
}

export class AbstractTable {
  public buttonSize() {
    return ButtonSize.Small;
  }
}
