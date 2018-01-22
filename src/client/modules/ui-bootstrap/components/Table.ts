import { Component, Input } from '@angular/core';
import { AbstractTable } from '../../common/components/Table';

@Component({
  selector: 'ausk-table',
  template: `
    <table class="table">
      <thead>
      <tr>
        <th *ngFor="let column of columns; index as i;"
            [class]="'w-' + (columns.length === 2 ? 100 : 100 / columns.length) +
                  (column.columnSpan > 1 ? ' text-center' : '')"
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
          <div *ngIf="cell.type.length > 1; else singleElement" [ngStyle]="{'width': cell.width}">
            <table-cell [cells]="cell" [buttonSize]="buttonSize()"></table-cell>
          </div>
          <ng-template #singleElement>
            <table-cell [cells]="cell" [buttonSize]="buttonSize()"></table-cell>
          </ng-template>
        </td>
      </tr>
      </tbody>
    </table>
  `
})
export default class Table extends AbstractTable {}
