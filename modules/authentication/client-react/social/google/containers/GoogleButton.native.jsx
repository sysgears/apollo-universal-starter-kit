import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Linking, TouchableOpacity, Text, Platform } from 'react-native';
import { Google, WebBrowser } from 'expo';
import { withApollo } from 'react-apollo';
import { FontAwesome } from '@expo/vector-icons';
import { lookStyles } from '@gqlapp/look-client-react-native';

import settings from '@gqlapp/config';
import authentication from '../../../index';
import { buildRedirectUrlForMobile, defineLoginWay, saveTokens } from '../../../helpers';

import GOOGLE_EXPO_LOGIN from '../graphql/GoogleExpoLogin.graphql';

const {
  auth: {
    social: {
      googleExpo: { androidClientId, iosClientId }
    }
  }
} = settings;

const {
  iconWrapper,
  linkText,
  link,
  buttonContainer,
  separator,
  btnIconContainer,
  btnTextContainer,
  btnText
} = lookStyles;

const googleLogin = () => {
  const url = buildRedirectUrlForMobile('google');
  if (Platform.OS === 'ios') {
    WebBrowser.openBrowserAsync(url);
  } else {
    Linking.openURL(url);
  }
};

const googleExpoLogin = async client => {
  try {
    const { accessToken, type } = await Google.logInAsync({
      clientId: Platform.OS === 'ios' ? iosClientId : androidClientId
    });

    if (type === 'success') {
      // Gets accessToken, refreshToken and save them to storage
      const { data } = await client.mutate({
        mutation: GOOGLE_EXPO_LOGIN,
        variables: {
          input: { accessToken }
        }
      });

      if (data && data.googleExpoLogin) {
        const { accessToken, refreshToken } = data.googleExpoLogin;
        await saveTokens({ accessToken, refreshToken });
        await authentication.doLogin(client);
      }
    } else {
      return { cancelled: true };
    }
  } catch (e) {
    return { error: true };
  }
};

/**
 * Defines and returns a method for processing authorization
 * depending on the app settings
 */
const handleLogin = defineLoginWay('google', googleLogin, googleExpoLogin);

const GoogleButton = withApollo(({ text, client }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={() => handleLogin(client)}>
      <View style={styles.btnIconContainer}>
        <FontAwesome name="google-plus-square" size={30} style={{ color: '#fff', marginLeft: 10 }} />
        <View style={styles.separator} />
      </View>
      <View style={styles.btnTextContainer}>
        <Text style={styles.btnText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
});

const GoogleLink = withApollo(({ text, client }) => {
  return (
    <TouchableOpacity onPress={() => handleLogin(client)} style={styles.link}>
      <Text style={styles.linkText}>{text}</Text>
    </TouchableOpacity>
  );
});

const GoogleIcon = withApollo(({ client }) => (
  <View style={styles.iconWrapper}>
    <FontAwesome style={{ color: '#c43832' }} onPress={() => handleLogin(client)} name="google-plus-square" size={45} />
  </View>
));

class GoogleComponent extends React.Component {
  render() {
    const { type, text } = this.props;
    switch (type) {
      case 'button':
        return <GoogleButton text={text} />;
      case 'link':
        return <GoogleLink text={text} />;
      case 'icon':
        return <GoogleIcon />;
      default:
        return <GoogleButton text={text} />;
    }
  }
}

GoogleComponent.propTypes = {
  client: PropTypes.object,
  type: PropTypes.string,
  text: PropTypes.string.isRequired,
  writeQuery: PropTypes.func
};

const styles = StyleSheet.create({
  iconWrapper,
  linkText,
  link,
  buttonContainer: {
    ...buttonContainer,
    marginTop: 15,
    backgroundColor: '#c43832'
  },
  separator: {
    ...separator,
    backgroundColor: '#fff'
  },
  btnIconContainer,
  btnTextContainer,
  btnText
});

export default GoogleComponent;
