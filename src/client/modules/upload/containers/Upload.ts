import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

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

// /*eslint-disable no-unused-vars*/
// // React
// import React from 'react';
//
// // Apollo
// import { graphql, compose } from 'react-apollo';
//
// // Components
// import UploadView from '../components/UploadView';
//
// import UPLOAD_FILE from '../graphql/UploadFile.graphql';
//
// class Upload extends React.Component {
//   render() {
//     return <UploadView {...this.props} />;
//   }
// }
//
// const UploadWithApollo = compose(
//   graphql(UPLOAD_FILE, {
//     props: ({ mutate }) => ({
//       uploadFile: async file => {
//         return await mutate({
//           variables: { file }
//         });
//       }
//     })
//   })
// )(Upload);
//
// export default UploadWithApollo;
