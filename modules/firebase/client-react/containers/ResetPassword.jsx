import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { translate } from '@gqlapp/i18n-client-react';

import { FormError } from '@gqlapp/forms-client-react';
import ResetPasswordView from '../components/ResetPasswordView';
import RESET_PASSWORD from '../graphql/ResetPassword.graphql';

class ResetPassword extends React.Component {
  static propTypes = {
    resetPassword: PropTypes.func,
    t: PropTypes.func,
    history: PropTypes.object,
    match: PropTypes.object
  };
  onSubmit = async values => {
    const { t, resetPassword, history, match } = this.props;

    try {
      await resetPassword({ ...values, token: match.params.token });
    } catch (e) {
      throw new FormError(t('resetPass.errorMsg'), e);
    }

    history.push('/login');
  };

  render() {
    return <ResetPasswordView {...this.props} onSubmit={this.onSubmit} />;
  }
}

const ResetPasswordWithApollo = compose(
  translate('firebase'),

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
