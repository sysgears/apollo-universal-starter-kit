import React from 'react';
import { graphql, compose } from 'react-apollo';
import { translate } from '@module/i18n-client-react';

import { FormErrors } from '@module/forms-client-react';
import ResetPasswordView from '../components/ResetPasswordView';
import RESET_PASSWORD from '../graphql/ResetPassword.graphql';

class ResetPassword extends React.Component {
  onSubmit = async values => {
    const { t, resetPassword, history } = this.props;

    try {
      await resetPassword({ ...values, token: this.props.match.params.token });
    } catch (e) {
      throw new FormErrors(t('resetPass.errorMsg'), e);
    }

    history.push('/login');
  };

  render() {
    return <ResetPasswordView {...this.props} onSubmit={this.onSubmit} />;
  }
}

const ResetPasswordWithApollo = compose(
  translate('user'),

  graphql(RESET_PASSWORD, {
    props: ({ mutate }) => ({
      resetPassword: async ({ password, passwordConfirmation, token }) => {
        const {
          data: { resetPassword }
        } = await mutate({
          variables: { input: { password, passwordConfirmation, token } }
        });

        return resetPassword;
      }
    })
  })
)(ResetPassword);

export default ResetPasswordWithApollo;
