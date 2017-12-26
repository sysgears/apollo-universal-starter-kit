import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as RESET_PASSWORD from '../graphql/ResetPassword.graphql';

@Injectable()
export class ResetPasswordService {
  constructor(private apollo: Apollo) {}

  public resetPassword(password: string, passwordConfirmation: string, token: string, callback: (result: any) => any) {
    const resetPassword = this.apollo.mutate({
      mutation: RESET_PASSWORD,
      variables: { input: { password, passwordConfirmation, token } }
    });
    this.subscribe(resetPassword, callback);
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
