import React from 'react';
import { graphql, compose } from 'react-apollo';

import ForgotPasswordView from '../components/ForgotPasswordView';

import FORGOT_PASSWORD from '../graphql/ForgotPassword.graphql';

class ForgotPassword extends React.Component {
  render() {
    return <ForgotPasswordView {...this.props} />;
  }
}

const ForgotPasswordWithApollo = compose(
  graphql(FORGOT_PASSWORD, {
    props: ({ mutate }) => ({
      forgotPassword: async ({ email }) => {
        try {
          const {
            data: { forgotPassword }
          } = await mutate({
            variables: { input: { email } }
          });

          if (forgotPassword.errors) {
            return { errors: forgotPassword.errors };
          }
          return forgotPassword;
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(ForgotPassword);

export default ForgotPasswordWithApollo;
