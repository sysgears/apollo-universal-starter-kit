import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import CounterService from '../containers/Counter';
import { CounterIncrement } from '../reducers/index';

@Component({
  selector: 'counter-view',
  template: `
    <div *ngIf="loading" class="container">Loading...</div>
    <div *ngIf="!loading" class="container">
      <section>
        <p>Current counter, is {{counter.amount}}. This is being stored server-side in the database and using Apollo
          subscription for real-time updates.</p>
        <ausk-button [click]="addCount">Click to increase counter</ausk-button>
      </section>
      <section>
        <p>Current reduxCount, is {{reduxCount}}. This is being stored client-side with Redux.</p>
        <ausk-button [click]="onReduxIncrement">Click to increase reduxCount</ausk-button>
      </section>
    </div>`,
  styles: [
    `
      section {
          margin-bottom: 30px;
          text-align: center;
      }

      p {
          margin-top: 0;
          margin-bottom: 1em;
      }
  `
  ],
  providers: [CounterService]
})
export default class CounterView implements OnInit, OnDestroy {
  public loading: boolean = true;
  public counter: any;
  public reduxCount: number;
  private subsOnUpdate: Subscription;
  private subsOnLoad: Subscription;
  private subsOnAdd: Subscription;
  private subsOnStore: Subscription;

  constructor(private counterService: CounterService, private store: Store<any>, private ngZone: NgZone) {}

  public ngOnInit(): void {
    this.subsOnUpdate = this.counterService.subscribeToCount(({ data: { counterUpdated } }: any) => {
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

    this.subsOnStore = this.store.select('counter').subscribe(({ reduxCount }: any) => {
      this.reduxCount = reduxCount;
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe(this.subsOnUpdate, this.subsOnLoad, this.subsOnAdd, this.subsOnStore);
  }

  public addCount = () => {
    this.unsubscribe(this.subsOnAdd);
    this.subsOnAdd = this.counterService.addCounter(1, this.counter.amount);
  };

  public onReduxIncrement = () => {
    this.store.dispatch(new CounterIncrement());
  };

  private unsubscribe = (...subscriptions: Subscription[]) => {
    subscriptions.forEach((subscription: Subscription) => {
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
      }
    });
  };
}
