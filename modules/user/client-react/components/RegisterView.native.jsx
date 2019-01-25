import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Linking, Platform } from 'react-native';

import RegisterForm from '../components/RegisterForm';

class RegisterView extends React.PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
    onSubmit: PropTypes.func
  };

  async componentDidMount() {
    Linking.addEventListener('url', this.handleUrl);
    if (Platform.OS === 'ios') {
      const url = await Linking.getInitialURL();
      this.handleUrl({ url });
    }
  }

  handleUrl = ({ url }) => {
    if (url.includes('/confirmation/') || url.includes('/reset-password/')) {
      this.redirectOnActivateUser(url);
    }
  };

  redirectOnActivateUser = url => {
    this.props.navigation.navigate('ActivateUser', { url });
  };

  render() {
    const { onSubmit } = this.props;
    return (
      <View style={styles.container}>
        <RegisterForm onSubmit={onSubmit} />
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

export default RegisterView;
