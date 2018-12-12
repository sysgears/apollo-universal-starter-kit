import { Component } from '@angular/core';
import { Apollo, Query, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { COUNTER_QUERY, ADD_COUNTER, COUNTER_SUBSCRIPTION } from '@module/counter-common';

@Component({
  selector: 'server-counter-button',
  template: `
    <button id="graphql-button" color="primary" (click)="increaseCounter()">Click to increase counter</button>
  `,
  styles: []
})
export class ServerCounterButtonComponent {
  constructor(private apollo: Apollo) {}

  public increaseCounter() {
    this.apollo
      .mutate({
        mutation: ADD_COUNTER,
        variables: {
          amount: 1
        }
      })
      .subscribe();
  }
}

@Component({
  selector: 'server-counter',
  template: `
    <section *ngIf="!counter"><div className="text-center">Loading</div></section>
    <section *ngIf="counter">
      <p>Server Counter Amount: {{ counter | async }}</p>
      <server-counter-button></server-counter-button>
    </section>
  `,
  styles: [
    `
      section {
        margin-bottom: 30px;
        text-align: center;
      }
    `
  ]
})
export class ServerCounterViewComponent {
  public counter: Observable<number>;
  public counterQuery: QueryRef<any>;

  constructor(private apollo: Apollo) {}

  public ngOnInit() {
    this.counterQuery = this.apollo.watchQuery<Query>({
      query: COUNTER_QUERY
    });

    this.counter = this.counterQuery.valueChanges.pipe(map((result: any) => result.data.serverCounter.amount));

    this.counterQuery.subscribeToMore({
      document: COUNTER_SUBSCRIPTION,
      variables: {},
      updateQuery: (prev: any, { subscriptionData }: any) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const {
          data: {
            counterUpdated: { amount }
          }
        } = subscriptionData;

        return {
          ...prev,
          serverCounter: {
            amount,
            __typename: 'Counter'
          }
        };
      }
    });
  }
}
