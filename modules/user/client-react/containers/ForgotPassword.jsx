import React from 'react';
import { graphql, compose } from 'react-apollo';

import { translate } from '@module/i18n-client-react';
import FormikMessageHandler from './FormikMessageHandler';

import ForgotPasswordView from '../components/ForgotPasswordView';

import FORGOT_PASSWORD from '../graphql/ForgotPassword.graphql';

class ForgotPassword extends React.Component {
  state = {
    sent: false
  };

  onSubmit = async values => {
    const { forgotPassword, t, handleError } = this.props;

    await handleError(() => forgotPassword(values), t('forgotPass.errorMsg'));

    this.setState({ sent: true });
  };

  render() {
    const { sent } = this.state;

    return <ForgotPasswordView {...this.props} sent={sent} onSubmit={this.onSubmit} />;
  }
}

const ForgotPasswordWithApollo = compose(
  translate('user'),
  FormikMessageHandler,
  graphql(FORGOT_PASSWORD, {
    props: ({ mutate }) => ({
      forgotPassword: async ({ email }) => {
        try {
          const {
            data: { forgotPassword }
          } = await mutate({
            variables: { input: { email } }
          });

          return forgotPassword;
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(ForgotPassword);

export default ForgotPasswordWithApollo;
