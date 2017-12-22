import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ausk-button',
  template: `
    <button
        type="{{type || 'button'}}"
        class="{{className || 'btn btn-primary'}}"
        [attr.disabled]="disabled || null"
        (click)="onClick()">
      <ng-content></ng-content>
    </button>
  `
})
export class Button {
  @Input() public type: string;
  @Input() public className: string;
  @Input() public click: any;
  @Input() public disabled: boolean;

  public onClick() {
    if (this.click) {
      this.click();
    }
  }
}
