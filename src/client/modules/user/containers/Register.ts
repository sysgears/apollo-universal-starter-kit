import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as REGISTER from '../graphql/Register.graphql';

@Injectable()
export default class RegisterService {
  constructor(private apollo: Apollo) {}

  public register(username: string, email: string, password: string, callback: (result: any) => any) {
    const reg = this.apollo.mutate({
      mutation: REGISTER,
      variables: { input: { username, email, password } }
    });
    this.subscribe(reg, callback);
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
