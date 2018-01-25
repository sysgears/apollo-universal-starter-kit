import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import CounterService from '../containers/Counter';
import { CounterIncrement } from '../reducers';

@Component({
  selector: 'counter-view',
  template: `
    <div *ngIf="loading" class="text-center">Loading...</div>
      <div *ngIf="!loading" class="text-center mt-4 mb-4">
        <section>
          <p>Current counter, is {{counter.amount}}. This is being stored server-side in the database and using Apollo subscription for real-time updates.</p>
          <label id="graphql-button" class="btn-primary" (click)="addCount()" ngbButtonLabel>Click to increase counter</label>
        </section>
        <section>
          <p>Current reduxCount, is {{reduxCount}}. This is being stored client-side with Redux.</p>
          <label id="redux-button" class="btn-primary" (click)="onReduxIncrement()" ngbButtonLabel>Click to increase reduxCount</label>
        </section>
        <section>
          <p>Current apolloLinkStateCounter, is {{apolloLinkCounter}}. This is being stored client-side with
            apollo-link-state.</p>
          <ausk-button [click]="addCountClient">Click to increase apolloLinkStateCounter</ausk-button>
        </section>
      </div>`,
  styles: ['section { margin-bottom: 30px; }'],
  providers: [CounterService]
})
export default class CounterView implements OnInit, OnDestroy {
  public loading: boolean = true;
  public counter: any;
  public reduxCount: number;
  public apolloLinkCounter: number;
  private subsOnUpdate: Subscription;
  private subsOnLoad: Subscription;
  private subsOnLoadClient: Subscription;
  private subsOnAdd: Subscription;
  private subsOnAddClient: Subscription;
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

    this.subsOnLoadClient = this.counterService.getCounterClient(({ data: { counterState }, loading }: any) => {
      this.ngZone.run(() => {
        this.apolloLinkCounter = counterState.counter;
      });
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe(this.subsOnUpdate, this.subsOnLoad, this.subsOnLoadClient, this.subsOnAdd, this.subsOnStore);
  }

  public addCount() {
    this.unsubscribe(this.subsOnAdd);
    this.subsOnAdd = this.counterService.addCounter(1, this.counter.amount);
  }

  public addCountClient = () => {
    this.unsubscribe(this.subsOnAddClient);
    this.subsOnAddClient = this.counterService.addCounterClient(this.apolloLinkCounter);
  };

  public onReduxIncrement() {
    this.store.dispatch(new CounterIncrement());
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
