import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as ADD_COUNTER from '../graphql/AddCounter.graphql';
import * as COUNTER_QUERY from '../graphql/CounterQuery.graphql';
import * as COUNTER_SUBSCRIPTION from '../graphql/CounterSubscription.graphql';

@Injectable()
export class CounterService {
  constructor(private apollo: Apollo) {}

  public subscribeToCount(callback: (result: any) => any) {
    const counterSubscriptionQuery = this.apollo.subscribe({
      query: COUNTER_SUBSCRIPTION,
      variables: {}
    });
    return this.subscribe(counterSubscriptionQuery, callback);
  }

  public getCounter(callback: (result: any) => any) {
    const counterQuery = this.apollo.watchQuery({ query: COUNTER_QUERY });
    return this.subscribe(counterQuery, callback);
  }

  public addCounter(amount: number, optimisticValue?: number) {
    const addCounterQuery = this.apollo.mutate({
      mutation: ADD_COUNTER,
      variables: { amount },
      optimisticResponse: { addCounter: { amount: optimisticValue + 1, __typename: 'Counter' } },
      updateQueries: {
        counterQuery: (prev, { mutationResult }) => {
          const newAmount = mutationResult.data.addCounter.amount;
          return {
            counter: {
              ...prev.counter,
              amount: newAmount
            }
          };
        }
      }
    });
    return this.subscribe(addCounterQuery);
  }

  private subscribe(observable: Observable<any>, cb?: (result: Observable<any>) => any): Subscription {
    const subscription = observable.subscribe({
      next: result => {
        try {
          if (cb) {
            cb(result);
          }
        } catch (e) {
          setImmediate(() => {
            subscription.unsubscribe();
          });
        }
      }
    });
    return subscription;
  }
}
