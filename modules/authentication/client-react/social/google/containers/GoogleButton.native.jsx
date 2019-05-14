import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Linking, TouchableOpacity, Text, Platform } from 'react-native';
import { Google, WebBrowser } from 'expo';
import { withApollo } from 'react-apollo';
import { FontAwesome } from '@expo/vector-icons';
import { lookStyles } from '@gqlapp/look-client-react-native';
import { setItem } from '@gqlapp/core-common/clientStorage';

import settings from '@gqlapp/config';
import authentication from '../../../index';
import { buildRedirectUrlForMobile } from '../../../helpers';

import GOOGLE_EXPO_LOGIN from '../graphql/GoogleExpoLogin.graphql';

const {
  auth: {
    social: {
      googleExpo: { androidClientId }
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

const saveTokens = async ({ accessToken, refreshToken }) => {
  await setItem('accessToken', accessToken);
  await setItem('refreshToken', refreshToken);
};

// const  googleExpoLogin = async() => {
const googleExpoLogin = async client => {
  try {
    const profile = await Google.logInAsync({
      androidClientId,
      scopes: ['profile', 'email']
    });

    if (profile.type === 'success') {
      console.log('profile --->', profile);

      const {
        user: { email, id, name }
      } = profile;
      const { data } = await client.mutate({
        mutation: GOOGLE_EXPO_LOGIN,
        variables: {
          input: { id, name, email }
        }
      });

      if (data && data.googleExpoLogin) {
        const { accessToken, refreshToken } = data.googleExpoLogin;
        await saveTokens({ accessToken, refreshToken });
      }

      await authentication.doLogin(client);
    } else {
      return { cancelled: true };
    }
  } catch (e) {
    return { error: true };
  }
};

// const handleLogin = defineLoginWay('google', googleLogin, googleExpoLogin);

const GoogleButton = withApollo(data => {
  const { text, client } = data;
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={() => googleExpoLogin(client)}>
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

const GoogleLink = withApollo(({ text }) => {
  return (
    <TouchableOpacity onPress={googleLogin} style={styles.link}>
      <Text style={styles.linkText}>{text}</Text>
    </TouchableOpacity>
  );
});

const GoogleIcon = () => (
  <View style={styles.iconWrapper}>
    <FontAwesome style={{ color: '#c43832' }} onPress={googleLogin} name="google-plus-square" size={45} />
  </View>
);

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
