// React
import React from 'react';
import PropTypes from 'prop-types';
import { translate } from '@module/i18n-client-react';
// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import { FormError } from '@module/forms-client-react';
import RegisterView from '../components/RegisterView';

import REGISTER from '../graphql/Register.graphql';

class Register extends React.Component {
  static propTypes = {
    register: PropTypes.func,
    history: PropTypes.object,
    t: PropTypes.func,
    navigation: PropTypes.object
  };

  onSubmit = async values => {
    const { t, register, history, navigation } = this.props;

    try {
      await register(values);
    } catch (e) {
      throw new FormError(t('reg.errorMsg'), e);
    }

    if (history) {
      history.push('/profile');
    } else if (navigation) {
      navigation.goBack();
    }
  };

  render() {
    return <RegisterView {...this.props} onSubmit={this.onSubmit} />;
  }
}

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
