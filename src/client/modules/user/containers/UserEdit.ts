import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as ADD_USER from '../graphql/AddUser.graphql';
import * as EDIT_USER from '../graphql/EditUser.graphql';
import * as USER_QUERY from '../graphql/UserQuery.graphql';

@Injectable()
export class UserEditService {
  constructor(private apollo: Apollo) {}

  public user(id: number | string, callback: (result: any) => any) {
    const user = this.apollo.watchQuery({
      query: USER_QUERY,
      variables: { id }
    });
    this.subscribe(user, callback);
  }

  public addUser(input: any, callback: (result: any) => any) {
    const addUser = this.apollo.mutate({
      mutation: ADD_USER,
      variables: { input }
    });
    this.subscribe(addUser, callback);
  }

  public editUser(input: any, callback: (result: any) => any) {
    const editUser = this.apollo.mutate({
      mutation: EDIT_USER,
      variables: { input }
    });
    this.subscribe(editUser, callback);
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
