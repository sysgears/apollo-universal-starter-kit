import { Component, Input } from '@angular/core';
import { AbstractTable, CellData } from '../../common/components/Table';

@Component({
  selector: 'ausk-table',
  template: `
    <table class="{{className || 'table'}}">
      <thead>
      <tr>
        <th *ngFor="let column of columns; index as i;"
            [class]="'w-' + (columns.length === 2 ? 100 : 100 / columns.length) +
                  (column.columnSpan > 1 ? ' text-center' : '')"
            [attr.width]="column.width"
            [attr.colSpan]="column.columnSpan">
          {{column.title}}
          <ausk-link *ngIf="column.sorting" (click)="column.sorting($event, column.value)">
            <span [innerHTML]="column.iconRender(column.value)"></span>
          </ausk-link>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let row of rows">
        <td *ngFor="let cell of row">
          <ausk-link *ngIf="cell.type === 0" [to]="cell.link">
            {{cell.text}}
          </ausk-link>

          <ausk-button *ngIf="cell.type === 1" [click]="cell.callback" [btnStyle]="cell.className" [btnSize]="buttonSize()">
            {{cell.text}}
          </ausk-button>

          <span *ngIf="cell.type === 2">
            {{cell.text}}
          </span>
        </td>
      </tr>
      </tbody>
    </table>
  `
})
export default class Table extends AbstractTable {
  @Input() public className: string;
  @Input() public columns: any;
  @Input() public rows: CellData[];
}
