import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import CounterService from '../containers/Counter';
import { COUNTER } from '../reducers/actionTypes';
import { counterStore } from '../reducers/index';

@Component({
  selector: 'counter-view',
  template: `
    <div *ngIf="loading" class="text-center">Loading...</div>
    <div *ngIf="!loading" id="content" class="container">
      <div class="text-center mt-4 mb-4">
        <section>
          <p>Current counter, is {{counter.amount}}. This is being stored server-side in the database and using Apollo subscription for real-time updates.</p>
          <label id="graphql-button" class="btn-primary" (click)="addCount()" ngbButtonLabel>Click to increase counter</label>
        </section>
        <section>
          <p>Current reduxCount, is {{reduxCount}}. This is being stored client-side with Redux.</p>
          <label id="redux-button" class="btn-primary" (click)="onReduxIncrement()" ngbButtonLabel>Click to increase reduxCount</label>
        </section>
      </div>
    </div>`,
  styles: ['section { margin-bottom: 30px; }'],
  providers: [CounterService]
})
export default class CounterView implements OnInit, OnDestroy {
  public loading: boolean = true;
  public counter: any;
  public reduxCount: number;
  private subsOnUpdate: Subscription;
  private subsOnLoad: Subscription;
  private subsOnAdd: Subscription;

  constructor(private counterService: CounterService, private ngZone: NgZone) {
    this.setReduxCount();
  }

  public ngOnInit(): void {
    this.subsOnUpdate = this.counterService.subscribeToCount(({ counterUpdated }: any) => {
      this.ngZone.run(() => {
        this.counter = counterUpdated;
      });
    });

    this.subsOnLoad = this.counterService.getCounter(({ data: { counter }, loading }: any) => {
      this.ngZone.run(() => {
        this.counter = counter;
        this.loading = loading || false;
      });
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe(this.subsOnUpdate, this.subsOnLoad);
  }

  public addCount() {
    this.unsubscribe(this.subsOnAdd);
    this.subsOnAdd = this.counterService.addCounter(1, this.counter.amount);
  }

  public onReduxIncrement() {
    counterStore.dispatch({ type: COUNTER.INCREMENT });
    this.setReduxCount();
  }

  public onReduxIncrease(value: number) {
    counterStore.dispatch({ type: COUNTER.INCREASE, value });
    this.setReduxCount();
  }

  private setReduxCount() {
    this.reduxCount = counterStore.getState().reduxCount || 1;
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
