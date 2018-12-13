import React from 'react';
import { graphql, compose } from 'react-apollo';

import { translate } from '@module/i18n-client-react';
import { FieldError } from '@module/validation-common-react';

import ForgotPasswordView from '../components/ForgotPasswordView';

import FORGOT_PASSWORD from '../graphql/ForgotPassword.graphql';

class ForgotPassword extends React.Component {
  state = {
    sent: false
  };

  onSubmit = ({ forgotPassword, t }) => async values => {
    this.setState({ sent: true });

    const errors = new FieldError((await forgotPassword(values)).errors);
    if (errors && errors.errors) {
      throw { ...errors.errors, handleErr: t('forgotPass.errorMsg') };
    }
  };

  render() {
    const { sent } = this.state;
    console.log('sentsentsent', sent);
    return <ForgotPasswordView {...this.props} sent={sent} onSubmit={this.onSubmit} />;
  }
}

const ForgotPasswordWithApollo = compose(
  translate('user'),
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
