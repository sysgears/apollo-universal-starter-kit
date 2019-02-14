import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import { translate } from '@gqlapp/i18n-client-react';
import { FormError } from '@gqlapp/forms-client-react';
import ForgotPasswordView from '../components/ForgotPasswordView';

import FORGOT_PASSWORD from '../graphql/ForgotPassword.graphql';

const ForgotPassword = props => {
  const { forgotPassword, t } = props;

  const [sent, setSent] = useState(false);

  const onSubmit = async values => {
    setSent(true);
    try {
      await forgotPassword(values);
    } catch (e) {
      throw new FormError(t('forgotPass.errorMsg'), e);
    }
  };

  return <ForgotPasswordView {...props} sent={sent} onSubmit={onSubmit} />;
};

ForgotPassword.propTypes = {
  forgotPassword: PropTypes.func,
  t: PropTypes.func
};

const ForgotPasswordWithApollo = props => (
  <Mutation mutation={FORGOT_PASSWORD}>
    {mutate => {
      const forgotPassword = async ({ email }) => {
        const {
          data: { forgotPassword }
        } = await mutate({
          variables: { input: { email } }
        });
        return forgotPassword;
      };

      return <ForgotPassword {...props} forgotPassword={forgotPassword} />;
    }}
  </Mutation>
);

export default translate('user')(ForgotPasswordWithApollo);
