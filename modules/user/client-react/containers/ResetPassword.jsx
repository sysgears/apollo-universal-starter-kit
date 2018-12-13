import React from 'react';
import { graphql, compose } from 'react-apollo';
import { FieldError } from '@module/validation-common-react';
import { translate } from '@module/i18n-client-react';

import ResetPasswordView from '../components/ResetPasswordView';

import RESET_PASSWORD from '../graphql/ResetPassword.graphql';

class ResetPassword extends React.Component {
  onSubmit = async values => {
    const { t, resetPassword } = this.props;

    const errors = new FieldError(
      (await resetPassword({
        ...values,
        token: this.props.match.params.token
      })).errors
    );

    if (errors.hasAny()) throw { ...errors.errors, handleErr: t('resetPass.errorMsg') };
  };

  render() {
    return <ResetPasswordView {...this.props} onSubmit={this.onSubmit} />;
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
)(ResetPassword);

export default ResetPasswordWithApollo;
