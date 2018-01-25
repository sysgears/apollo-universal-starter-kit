import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as FILTER_CHANGE from '../graphql/ChangeFilterState.graphql';
import * as FILTER_STATE_QUERY from '../graphql/FilterState.graphql';

@Injectable()
export default class UserFilterService {
  constructor(private apollo: Apollo) {}

  public filterChange({ searchText: searchText, role: role, isActive: isActive, orderBy: orderBy }: any) {
    const filterChangeQuery = this.apollo.mutate({
      mutation: FILTER_CHANGE,
      variables: {
        searchText,
        role,
        isActive,
        orderBy
      }
    });
    return this.subscribe(filterChangeQuery);
  }

  public getFilterState(callback: (result: any) => any) {
    const searchTextQuery = this.apollo.watchQuery({ query: FILTER_STATE_QUERY });
    return this.subscribe(searchTextQuery, callback);
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
