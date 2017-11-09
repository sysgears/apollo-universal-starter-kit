import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { Observable } from 'rxjs/Observable';
import * as ADD_COUNTER from '../graphql/AddCounter.graphql';
import * as COUNTER_QUERY from '../graphql/CounterQuery.graphql';
import * as COUNTER_SUBSCRIPTION from '../graphql/CounterSubscription.graphql';

@Injectable()
export default class CounterService {
  public subscription: Observable<any>;
  constructor(private apollo: Apollo) {}

  public subscribeToCount() {
    if (!this.subscription) {
      this.subscription = this.apollo.subscribe({
        query: COUNTER_SUBSCRIPTION,
        variables: {}
      });
    }
    return this.subscription;
  }

  public getCounter() {
    return this.apollo.watchQuery({ query: COUNTER_QUERY });
  }

  public addCounter(amount: number, optimisticValue?: number) {
    return this.apollo.mutate({
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
  }
}
