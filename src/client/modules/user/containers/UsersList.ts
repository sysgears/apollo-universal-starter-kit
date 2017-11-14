import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as DELETE_USER from '../graphql/DeleteUser.graphql';
import * as USERS_QUERY from '../graphql/UsersQuery.graphql';

@Injectable()
export default class UsersListService {
  constructor(private apollo: Apollo) {}

  public getUsers(orderBy: any, searchText: string, role: string, isActive: boolean, callback: (result: any) => any) {
    const usersQuery = this.apollo.watchQuery({
      query: USERS_QUERY,
      fetchPolicy: 'cache-and-network',
      variables: {
        orderBy,
        filter: { searchText, role, isActive }
      }
    });
    return this.subscribe(usersQuery, callback);
  }

  public deleteUser(id: number, callback: (result: any) => any) {
    const deleteUserQuery = this.apollo.mutate({
      mutation: DELETE_USER,
      variables: { id },
      refetchQueries: [`users`]
    });
    return this.subscribe(deleteUserQuery, callback);
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
