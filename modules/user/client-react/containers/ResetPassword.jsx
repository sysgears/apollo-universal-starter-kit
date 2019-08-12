import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import { compose } from '@gqlapp/core-common';
import { translate } from '@gqlapp/i18n-client-react';
import { FormError } from '@gqlapp/forms-client-react';

import ResetPasswordView from '../components/ResetPasswordView';

import RESET_PASSWORD from '../graphql/ResetPassword.graphql';

const ResetPassword = props => {
  const { t, resetPassword, history, match } = props;

  const onSubmit = async values => {
    try {
      await resetPassword({ ...values, token: match.params.token });
    } catch (e) {
      throw new FormError(t('resetPass.errorMsg'), e);
    }
    history.push('/login');
  };

  return <ResetPasswordView {...props} onSubmit={onSubmit} />;
};

ResetPassword.propTypes = {
  resetPassword: PropTypes.func,
  t: PropTypes.func,
  history: PropTypes.object,
  match: PropTypes.object
};

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
