// React
import React from 'react';
import PropTypes from 'prop-types';
import { translate } from '@gqlapp/i18n-client-react';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import { FormError } from '@gqlapp/forms-client-react';
import RegisterView from '../components/RegisterView';

import REGISTER from '../graphql/Register.graphql';

import settings from '../../../../settings';

class Register extends React.Component {
  state = {
    isRegistered: false
  };

  onSubmit = async values => {
    const { t, register, navigation } = this.props;

    try {
      await register(values);
      if (!settings.auth.password.requireEmailConfirmation) {
        navigation.goBack();
      } else {
        this.setState({ isRegistered: true });
      }
    } catch (e) {
      throw new FormError(t('reg.errorMsg'), e);
    }
  };

  hideModal = () => {
    this.props.navigation.goBack();
  };

  toggleModal = () => {
    this.setState(prevState => ({ isRegistered: !prevState.isRegistered }));
  };

  render() {
    const { isRegistered } = this.state;
    return (
      <RegisterView {...this.props} isRegistered={isRegistered} hideModal={this.hideModal} onSubmit={this.onSubmit} />
    );
  }
}

Register.propTypes = {
  register: PropTypes.func,
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
