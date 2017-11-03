import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { UploadFile } from 'ngx-uploader/src/ngx-uploader/classes/interfaces';

import * as UPLOAD_FILE from '../graphql/UploadFile.graphql';

@Injectable()
export default class UploadService {
  constructor(private apollo: Apollo) {}

  public uploadFile(file: any) {
    return this.apollo.mutate({
      mutation: UPLOAD_FILE,
      variables: { file }
    });
  }
}
