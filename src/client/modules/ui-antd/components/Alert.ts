import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { AlertItem, AlertType } from '../../common/components/Alert';
import { ButtonStyle } from '../../common/components/Button';

const alertClasses = [
  {
    type: AlertType.SUCCESS,
    className: 'alert-success'
  },
  {
    type: AlertType.INFO,
    className: 'alert-info'
  },
  {
    type: AlertType.WARNING,
    className: 'alert-warning'
  },
  {
    type: AlertType.ERROR,
    className: 'alert-danger'
  }
];

@Component({
  selector: 'alert',
  template: `
    <div *ngIf="alerts">
      <div *ngFor="let alert of alerts" [id]="alert.alertId"
           class="alert alert-dismissible fade show {{ alert.type || '' }}"
           role="alert">
        <ausk-button [btnStyle]="buttonStyle()" (click)="onClose(alert)">
          <span aria-hidden="true">&times;</span>
        </ausk-button>
        {{ alert.message }}
      </div>
    </div>
  `
})
export default class Alert implements OnInit, OnDestroy {
  @Input() public subject: Subject<AlertItem>;
  public alerts: AlertItem[] = [];
  private subscription: Subscription;

  public ngOnInit(): void {
    this.subscription = this.subject.subscribe((alert: any) => {
      setTimeout(() => this.onClose(alert), 5000);
      alert.type = this.getClassByType(alert.type);
      this.alerts.push(alert);
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe(this.subscription);
  }

  public onClose(alert: AlertItem) {
    const index = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  public buttonStyle() {
    return ButtonStyle.Close;
  }

  private getClassByType(type: AlertType) {
    return alertClasses.find((alertClass: any) => alertClass.type === type).className;
  }

  private unsubscribe = (...subscriptions: Subscription[]) => {
    subscriptions.forEach((subscription: Subscription) => {
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
      }
    });
  };
}
