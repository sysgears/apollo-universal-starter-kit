import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as UPLOAD_FILE from '../graphql/UploadFile.graphql';

@Injectable()
export default class UploadService {
  constructor(private apollo: Apollo) {}

  public uploadFile(file: any, callback: (result: any) => any) {
    const uploadFileQuery = this.apollo.mutate({
      mutation: UPLOAD_FILE,
      variables: { file }
    });
    return this.subscribe(uploadFileQuery, callback);
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
