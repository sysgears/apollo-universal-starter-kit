import { Component, Input } from '@angular/core';

@Component({
  selector: 'btn',
  template: `
  <button mat-button [color]="color">
    <ng-content></ng-content>
  </button>`,
  styles: []
})
export class ButtonComponent {
  @Input()
  public color: string = '';
}

@Component({
  selector: 'btn-raised',
  template: `
  <button mat-raised-button [color]="color">
    <ng-content></ng-content>
  </button>`,
  styles: []
})
export class ButtonRaisedComponent {
  @Input()
  public color: string = '';
}
