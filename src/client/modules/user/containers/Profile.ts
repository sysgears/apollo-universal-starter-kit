import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';

@Injectable()
export class ProfileService {
  constructor(private apollo: Apollo) {}

  public getCurrentUser(cb: (result: Observable<any>) => any) {
    const currentUser = this.apollo.watchQuery({
      query: CURRENT_USER_QUERY
    });
    return this.subscribe(currentUser, cb);
  }

  private subscribe(observable: Observable<any>, cb: (result: Observable<any>) => any): Subscription {
    const subscription = observable.subscribe({
      next: result => {
        try {
          cb(result);
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
