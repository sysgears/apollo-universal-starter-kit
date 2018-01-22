import { Input } from '@angular/core';
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
  @Input() public columns: any;
  @Input() public rows: CellData[];

  public buttonSize() {
    return ButtonSize.Small;
  }
}
