import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'alert',
  template: `
    <div [id]="id || ''" class="alert alert-dismissible fade show {{ className }}" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close" (click)="onClose()">
        <span aria-hidden="true">&times;</span>
      </button>
      <ng-content></ng-content>
    </div>
	`
})
export default class Alert implements OnInit {
  @Input() public id: string;
  @Input() public type: string;
  @Output() public close = new EventEmitter<boolean>();
  public className: string;

  public ngOnInit(): void {
    this.className = `alert-${this.type === 'error' ? 'danger' : this.type}`;
  }

  public onClose() {
    this.close.emit(true);
  }
}
