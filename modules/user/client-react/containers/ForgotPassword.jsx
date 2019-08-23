import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import { compose } from '@gqlapp/core-common';
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
