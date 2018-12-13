import React from 'react';
import { graphql, compose } from 'react-apollo';
import { translate } from '@module/i18n-client-react';
import withSubmit from './withSubmit';

import ResetPasswordView from '../components/ResetPasswordView';

import RESET_PASSWORD from '../graphql/ResetPassword.graphql';

class ResetPassword extends React.Component {
  render() {
    return <ResetPasswordView {...this.props} />;
  }
}

const ResetPasswordWithApollo = compose(
  translate('user'),
  graphql(RESET_PASSWORD, {
    props: ({ ownProps: { history }, mutate }) => ({
      resetPassword: async ({ password, passwordConfirmation, token }) => {
        try {
          const {
            data: { resetPassword }
          } = await mutate({
            variables: { input: { password, passwordConfirmation, token } }
          });

          if (resetPassword.errors) {
            return { errors: resetPassword.errors };
          }

          history.push('/login');
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(withSubmit(ResetPassword, 'resetPass'));

export default ResetPasswordWithApollo;
