import React from 'react';
import { graphql, compose } from 'react-apollo';

import { translate } from '@module/i18n-client-react';
import withSubmit from './withSubmit';

import ForgotPasswordView from '../components/ForgotPasswordView';

import FORGOT_PASSWORD from '../graphql/ForgotPassword.graphql';

class ForgotPassword extends React.Component {
  render() {
    return <ForgotPasswordView {...this.props} />;
  }
}

const ForgotPasswordWithApollo = compose(
  translate('user'),
  graphql(FORGOT_PASSWORD, {
    props: ({ mutate }) => ({
      handleRequest: async ({ email }) => {
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
)(withSubmit(ForgotPassword, 'forgotPass'));

export default ForgotPasswordWithApollo;
