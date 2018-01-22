import { Component, Input } from '@angular/core';
import { CellData } from './Table';

@Component({
  selector: 'table-cell',
  template: `
    <ng-container *ngFor="let type of cells.type; let i = index">
      <ausk-link *ngIf="cells.type[i] === 0" [to]="cells.link ? cells.link[i] : undefined">
        {{cells.text[i]}}
      </ausk-link>

      <ausk-button *ngIf="cells.type[i] === 1"
                   [click]="cells.callback ? cells.callback[i] : undefined"
                   [btnStyle]="cells.className ? cells.className[i] : undefined"
                   [btnSize]="buttonSize">
        {{cells.text[i]}}
      </ausk-button>

      <span *ngIf="cells.type[i] === 2">
      {{cells.text[i]}}
    </span>
    </ng-container>
  `
})
export default class TableCell {
  @Input() public cells: CellData[];
  @Input() public buttonSize: string;
}
