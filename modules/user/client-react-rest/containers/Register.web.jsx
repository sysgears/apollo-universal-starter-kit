// React
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { translate } from '@gqlapp/i18n-client-react';
// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import { FormError } from '@gqlapp/forms-client-react';
import RegisterView from '../components/RegisterView';

import REGISTER from '../graphql/Register.graphql';

import settings from '../../../../settings';

const Register = props => {
  const { t, register, history } = props;

  const [isRegistered, setIsRegistered] = useState(false);

  const onSubmit = async values => {
    try {
      await register(values);
      if (!settings.auth.password.requireEmailConfirmation) {
        history.push('/login');
      } else {
        setIsRegistered(true);
      }
    } catch (e) {
      throw new FormError(t('reg.errorMsg'), e);
    }
  };

  return <RegisterView {...props} isRegistered={isRegistered} onSubmit={onSubmit} />;
};

Register.propTypes = {
  register: PropTypes.func,
  history: PropTypes.object,
  t: PropTypes.func,
  navigation: PropTypes.object
};

const RegisterWithApollo = compose(
  translate('user'),

  graphql(REGISTER, {
    props: ({ mutate }) => ({
      register: async ({ username, email, password }) => {
        const {
          data: { register }
        } = await mutate({ variables: { input: { username, email, password } } });
        return register;
      }
    })
  })
)(Register);
export default RegisterWithApollo;
