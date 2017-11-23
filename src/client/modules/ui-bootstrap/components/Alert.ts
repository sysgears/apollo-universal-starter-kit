import { Component, Input } from '@angular/core';

interface AlertItem {
  id: string;
  message: string;
  type: string;
}

@Component({
  selector: 'alert',
  template: `
    <div *ngIf="data">
      <div *ngFor="let alert of data" id="{{ alert.id }}"
           class="alert alert-dismissible fade show alert-{{ alert.type || 'danger' }}"
           role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close" (click)="onClose(alert)">
          <span aria-hidden="true">&times;</span>
        </button>
        {{ alert.message }}
      </div>
    </div>
	`
})
export default class Alert {
  @Input() public data: AlertItem[];

  public onClose(alert: AlertItem) {
    const index = this.data.indexOf(alert);
    this.data.splice(index, 1);
  }
}
