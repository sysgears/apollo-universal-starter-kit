import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as ADD_COUNTER from '../graphql/AddCounter.graphql';
import * as COUNTER_QUERY from '../graphql/CounterQuery.graphql';
import * as COUNTER_SUBSCRIPTION from '../graphql/CounterSubscription.graphql';

import * as ADD_COUNTER_CLIENT from '../graphql/AddCounter_client.graphql';
import * as COUNTER_QUERY_CLIENT from '../graphql/CounterQuery_client.graphql';

@Injectable()
export default class CounterService {
  constructor(private apollo: Apollo) {}

  public subscribeToCount(callback: (result: any) => any) {
    const counterSubscriptionQuery = this.apollo.subscribe({
      query: COUNTER_SUBSCRIPTION,
      variables: {}
    });
    return this.subscribe(counterSubscriptionQuery, callback);
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

  public addCounterClient(amount: number) {
    const addCounterQuery = this.apollo.mutate({
      mutation: ADD_COUNTER_CLIENT,
      variables: { counter: amount + 1 }
    });
    return this.subscribe(addCounterQuery);
  }

  public getCounter(callback: (result: any) => any) {
    return this.getCounterCommon(COUNTER_QUERY, callback);
  }

  public getCounterClient(callback: (result: any) => any) {
    return this.getCounterCommon(COUNTER_QUERY_CLIENT, callback);
  }

  private getCounterCommon(query: any, callback: (result: any) => any) {
    const counterQuery = this.apollo.watchQuery({ query });
    return this.subscribe(counterQuery, callback);
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
