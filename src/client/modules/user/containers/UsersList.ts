import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as DELETE_USER from '../graphql/DeleteUser.graphql';
import * as USERS_QUERY from '../graphql/UsersQuery.graphql';
import * as USERS_SUBSCRIPTION from '../graphql/UsersSubscription.graphql';

export const AddUser = (prev: any, addUser: any) => {
  if (prev) {
    if (addUser.id !== null && prev.some((user: any) => addUser.id === user.id)) {
      return prev;
    }

    return [...prev, addUser];
  }
};

export const UpdateUser = (prev: any, updatedUser: any) => {
  if (prev) {
    const currentUser = prev.find((user: any) => user.id === updatedUser.id);
    if (currentUser) {
      const index = prev.indexOf(currentUser);
      if (index) {
        prev.splice(index, 1, currentUser);
      }
    }

    return prev;
  }
};

export const DeleteUser = (prev: any, id: any) => {
  if (prev) {
    const index = prev.findIndex((x: any) => x.id === id);
    if (index < 0) {
      return prev;
    }

    return prev.filter((comment: any) => comment.id !== id);
  }
};

@Injectable()
export default class UsersListService {
  public usersSubscription: Subscription;
  constructor(private apollo: Apollo) {}

  public subscribeToUsers(callback: (result: any) => any) {
    const usersSubscriptionQuery = this.apollo.subscribe({
      query: USERS_SUBSCRIPTION,
      variables: {}
    });
    return this.subscribe(usersSubscriptionQuery, callback);
  }

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

  public updateSubscription(subscription: Subscription) {
    if (this.usersSubscription && this.usersSubscription !== subscription) {
      this.usersSubscription.unsubscribe();
    }
    this.usersSubscription = subscription;
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
