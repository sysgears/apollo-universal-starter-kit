import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as FORGOT_PASSWORD from '../graphql/ForgotPassword.graphql';

@Injectable()
export class ForgotPasswordService {
  constructor(private apollo: Apollo) {}

  public forgotPassword(email: string, callback: (result: any) => any) {
    const forgotPassword = this.apollo.mutate({
      mutation: FORGOT_PASSWORD,
      variables: { input: { email } }
    });
    this.subscribe(forgotPassword, callback);
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
