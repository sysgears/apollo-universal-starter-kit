import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as REGISTER from '../graphql/Register.graphql';

@Injectable()
export default class RegisterService {
  constructor(private apollo: Apollo) {}

  public register(username: string, email: string, password: string) {
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

// // React
// import React from 'react';
// import PropTypes from 'prop-types';
//
// // Apollo
// import { graphql, compose } from 'react-apollo';
//
// // Components
// import RegisterView from '../components/RegisterView';
//
// import REGISTER from '../graphql/Register.graphql';
//
// class Register extends React.Component {
//   render() {
//     return <RegisterView {...this.props} />;
//   }
// }
//
// Register.propTypes = {
//   register: PropTypes.func.isRequired
// };
//
// const RegisterWithApollo = compose(
//   graphql(REGISTER, {
//     props: ({ ownProps: { history, navigation }, mutate }) => ({
//       register: async ({ username, email, password }) => {
//         try {
//           const { data: { register } } = await mutate({
//             variables: { input: { username, email, password } }
//           });
//
//           if (register.errors) {
//             return { errors: register.errors };
//           }
//           if (history) {
//             return history.push('/profile');
//           }
//           if (navigation) {
//             return navigation.goBack();
//           }
//         } catch (e) {
//           console.log(e.graphQLErrors);
//         }
//       }
//     })
//   })
// )(Register);
//
// export default RegisterWithApollo;
