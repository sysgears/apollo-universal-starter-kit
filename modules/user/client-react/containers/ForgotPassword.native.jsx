import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import { translate } from '@gqlapp/i18n-client-react';
import { FormError } from '@gqlapp/forms-client-react';
import ForgotPasswordView from '../components/ForgotPasswordView';

import FORGOT_PASSWORD from '../graphql/ForgotPassword.graphql';

class ForgotPassword extends React.Component {
  static propTypes = {
    forgotPassword: PropTypes.func,
    t: PropTypes.func
  };

  state = {
    sent: false
  };

  onSubmit = async values => {
    const { forgotPassword, t } = this.props;

    this.setState({ sent: true });
    try {
      await forgotPassword(values);
    } catch (e) {
      throw new FormError(t('forgotPass.errorMsg'), e);
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
