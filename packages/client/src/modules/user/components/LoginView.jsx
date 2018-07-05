import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Linking, Platform } from 'react-native';
import { WebBrowser } from 'expo';
import { placeholderColor } from '../../common/components/native/styles';

import settings from '../../../../../../settings';
import translate from '../../../i18n';

import LoginForm from './LoginForm';

import { setItem } from '../../common/clientStorage';
import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';

class LoginView extends React.PureComponent {
  componentDidMount() {
    Linking.addEventListener('url', this.handleOpenURL);
  }

  componentWillUnmount() {
    Linking.removeListener('url');
  }

  handleOpenURL = async ({ url }) => {
    // Extract stringified user string out of the URL
    const [, data] = url.match(/data=([^#]+)/);
    const decodedData = JSON.parse(decodeURI(data));
    const { client } = this.props;
    if (decodedData.tokens) {
      await setItem('accessToken', decodedData.tokens.accessToken);
      await setItem('refreshToken', decodedData.tokens.refreshToken);
    }

    if (decodedData.user) {
      await client.writeQuery({
        query: CURRENT_USER_QUERY,
        data: decodedData.user
      });
    }

    if (Platform.OS === 'ios') {
      WebBrowser.dismissBrowser();
    }
  };

  onSubmit = login => async values => {
    const { errors } = await login(values);

    if (errors && errors.length) {
      throw errors.reduce(
        (res, error) => {
          res[error.field] = error.message;
          return res;
        },
        { _error: this.props.t('login.errorMsg') }
      );
    }
  };

  renderAvailableLogins = () => (
    <View style={styles.examplesArea}>
      <Text style={styles.title}>{this.props.t('login.cardTitle')}:</Text>
      <Text style={styles.exampleText}>admin@example.com: admin123</Text>
      <Text style={styles.exampleText}>user@example.com: user1234</Text>
      {settings.subscription.enabled && <Text style={styles.exampleText}>subscriber@example.com: subscriber</Text>}
    </View>
  );

  render() {
    const { login, navigation } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.examplesContainer}>{this.renderAvailableLogins()}</View>
        <View style={styles.loginContainer}>
          <LoginForm onSubmit={this.onSubmit(login)} navigation={navigation} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 10
  },
  examplesArea: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: placeholderColor,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e3e3e3',
    padding: 10
  },
  examplesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: placeholderColor
  },
  exampleText: {
    fontSize: 14,
    fontWeight: '400',
    color: placeholderColor
  },
  loginContainer: {
    flex: 3
  }
});

LoginView.propTypes = {
  login: PropTypes.func.isRequired,
  t: PropTypes.func,
  error: PropTypes.string,
  navigation: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

export default translate('user')(LoginView);
