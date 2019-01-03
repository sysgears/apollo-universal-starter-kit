import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Linking } from 'react-native';
import { translate } from '@module/i18n-client-react';

import RegisterForm from '../components/RegisterForm';

class RegisterView extends React.PureComponent {
  static propTypes = {
    register: PropTypes.func.isRequired,
    t: PropTypes.func,
    navigation: PropTypes.object
  };

  async componentDidMount() {
    Linking.addEventListener('url', this.hundlerUrl);
    const url = await Linking.getInitialURL();
    if (url.includes('/confirmation/')) {
      this.redirectOnWaiting(url);
    }
  }
  hundlerUrl = ({ url }) => {
    this.props.navigation.navigate('Waiting', { url });
    if (url.includes('/confirmation/')) {
      this.redirectOnWaiting(url);
    }
  };

  redirectOnWaiting = url => {
    this.props.navigation.navigate('Waiting', { url });
  };

  onSubmit = async values => {
    const { register, t } = this.props;
    const { errors } = await register(values);

    if (errors && errors.length) {
      throw errors.reduce(
        (res, error) => {
          res[error.field] = error.message;
          return res;
        },
        { _error: t('reg.form.title') }
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <RegisterForm onSubmit={this.onSubmit} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'stretch',
    flex: 1
  }
});

export default translate('user')(RegisterView);
