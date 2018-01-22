import { Component } from '@angular/core';
import { AbstractTable } from '../../common/components/Table';

@Component({
  selector: 'ausk-table',
  template: `
    <div class="ant-table-wrapper">
      <div class="ant-spin-nested-loading">
        <div class="ant-spin-container">
          <div class="ant-table ant-table-large ant-table-scroll-position-left">
            <div class="ant-table-content">
              <div class="ant-table-body">
                <table class="">
                  <colgroup>
                    <col *ngFor="let column of columns" [attr.width]="column.width">
                  </colgroup>
                  <thead class="ant-table-thead">
                  <tr>
                    <th *ngFor="let column of columns" class="" [attr.colSpan]="column.columnSpan">
                      <span>{{column.title}}</span>
                      <ausk-link *ngIf="column.sorting" (click)="column.sorting($event, column.value)">
                        <span [innerHTML]="column.iconRender(column.value)"></span>
                      </ausk-link>
                    </th>
                  </tr>
                  </thead>
                  <tbody class="ant-table-tbody">
                  <tr class="ant-table-row  ant-table-row-level-0" *ngFor="let row of rows">
                    <td *ngFor="let cell of row" class="">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export default class Table extends AbstractTable {}
