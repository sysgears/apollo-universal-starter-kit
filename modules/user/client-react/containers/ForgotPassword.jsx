import React from 'react';
import { graphql, compose } from 'react-apollo';

import { translate } from '@module/i18n-client-react';
import { FormErrors } from '@module/forms-client-react';
import ForgotPasswordView from '../components/ForgotPasswordView';

import FORGOT_PASSWORD from '../graphql/ForgotPassword.graphql';

class ForgotPassword extends React.Component {
  state = {
    sent: false
  };

  onSubmit = async values => {
    const { forgotPassword, t } = this.props;

    this.setState({ sent: true });
    try {
      await forgotPassword(values);
    } catch (e) {
      throw new FormErrors(t('forgotPass.errorMsg'), e);
    }
  };

  render() {
    const { sent } = this.state;

    return <ForgotPasswordView {...this.props} sent={sent} onSubmit={this.onSubmit} />;
  }
}

const ForgotPasswordWithApollo = compose(
  translate('user'),
  graphql(FORGOT_PASSWORD, {
    props: ({ mutate }) => ({
      forgotPassword: async ({ email }) => {
        const {
          data: { forgotPassword }
        } = await mutate({
          variables: { input: { email } }
        });

        return forgotPassword;
      }
    })
  })
)(ForgotPassword);

export default ForgotPasswordWithApollo;
