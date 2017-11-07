import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as RESET_PASSWORD from '../graphql/ResetPassword.graphql';

@Injectable()
export default class ResetPasswordService {
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

// import React from 'react';
// import PropTypes from 'prop-types';
// import { graphql, compose } from 'react-apollo';
//
// import ResetPasswordView from '../components/ResetPasswordView';
//
// import RESET_PASSWORD from '../graphql/ResetPassword.graphql';
//
// class ResetPassword extends React.Component {
//   render() {
//     return <ResetPasswordView {...this.props} />;
//   }
// }
//
// ResetPassword.propTypes = {
//   resetPassword: PropTypes.func.isRequired
// };
//
// const ResetPasswordWithApollo = compose(
//   graphql(RESET_PASSWORD, {
//     props: ({ ownProps: { history }, mutate }) => ({
//       resetPassword: async ({ password, passwordConfirmation, token }) => {
//         try {
//           const { data: { resetPassword } } = await mutate({
//             variables: { input: { password, passwordConfirmation, token } }
//           });
//
//           if (resetPassword.errors) {
//             return { errors: resetPassword.errors };
//           }
//
//           history.push('/login');
//         } catch (e) {
//           console.log(e.graphQLErrors);
//         }
//       }
//     })
//   })
// )(ResetPassword);
//
// export default ResetPasswordWithApollo;
