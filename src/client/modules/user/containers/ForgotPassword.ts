import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as FORGOT_PASSWORD from '../graphql/ForgotPassword.graphql';

@Injectable()
export default class ForgotPasswordService {
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

// import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { graphql, compose } from 'react-apollo';
// import { reset } from 'redux-form';
//
// import ForgotPasswordView from '../components/ForgotPasswordView';
//
// import FORGOT_PASSWORD from '../graphql/ForgotPassword.graphql';
//
// class ForgotPassword extends React.Component {
//   render() {
//     return <ForgotPasswordView {...this.props} />;
//   }
// }
//
// ForgotPassword.propTypes = {
//   forgotPassword: PropTypes.func.isRequired
// };
//
// const ForgotPasswordWithApollo = compose(
//   graphql(FORGOT_PASSWORD, {
//     props: ({ mutate }) => ({
//       forgotPassword: async ({ email }) => {
//         try {
//           const { data: { forgotPassword } } = await mutate({
//             variables: { input: { email } }
//           });
//
//           if (forgotPassword.errors) {
//             return { errors: forgotPassword.errors };
//           }
//
//           return forgotPassword;
//         } catch (e) {
//           console.log(e.graphQLErrors);
//         }
//       }
//     })
//   }),
//   connect(null, dispatch => ({
//     onFormSubmitted() {
//       dispatch(reset('forgotPassword'));
//     }
//   }))
// )(ForgotPassword);
//
// export default ForgotPasswordWithApollo;
