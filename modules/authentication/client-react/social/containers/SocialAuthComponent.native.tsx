import url from 'url';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Linking, TouchableOpacity, Text, Platform } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';

const createAuthRedirectUrl = (authUrl: string): string => {
  const { protocol, hostname, port } = url.parse(__WEBSITE_URL__);
  // Both iOS Simulator and Node backend on iOS use localhost, so no need to use nip.io in this case
  const expoHostname = hostname === 'localhost' ? `localhost` : `${url.parse(Constants.linkingUrl).hostname}.nip.io`;
  const urlHostname = __DEV__ ? expoHostname : hostname;

  return `${protocol}//${urlHostname}${port ? ':' + port : ''}${authUrl}?expoUrl=${encodeURIComponent(
    Constants.linkingUrl
  )}`;
};

const redirectToSocialLogin = (authUrl: string) => {
  const absUrl = createAuthRedirectUrl(authUrl);
  if (Platform.OS === 'ios') {
    WebBrowser.openBrowserAsync(absUrl);
  } else {
    Linking.openURL(absUrl);
  }
};

interface ButtonProps {
  icon: string;
  text: string;
  backgroundColor: string;
  authUrl: string;
}

const SocialAuthButton = ({ text, icon, backgroundColor, authUrl }: ButtonProps) => (
  <TouchableOpacity style={styles.buttonContainer} onPress={() => redirectToSocialLogin(authUrl)}>
    <View style={styles.btnIconContainer}>
      <FontAwesome name={icon} size={30} style={[styles.buttonIcon, { backgroundColor }]} />
      <View style={styles.separator} />
    </View>
    <View style={styles.btnTextContainer}>
      <Text style={styles.btnText}>{text}</Text>
    </View>
  </TouchableOpacity>
);

interface LinkProps {
  text: string;
  authUrl: string;
}

const SocialAuthLink = ({ text, authUrl }: LinkProps) => (
  <TouchableOpacity onPress={() => redirectToSocialLogin(authUrl)} style={styles.link}>
    <Text style={styles.linkText}>{text}</Text>
  </TouchableOpacity>
);

interface IconProps {
  icon: string;
  backgroundColor: string;
  authUrl: string;
}

const SocialAuthIcon = ({ backgroundColor, icon, authUrl }: IconProps) => (
  <View style={styles.iconWrapper}>
    <FontAwesome
      name={icon}
      size={45}
      style={[styles.icon, { color: backgroundColor }]}
      onPress={() => redirectToSocialLogin(authUrl)}
    />
  </View>
);

interface ComponentProps {
  authUrl: string;
  icon: string;
  backgroundColor: string;
  text: string;
  type: string;
}

const SocialAuthComponent = (props: ComponentProps) => {
  switch (props.type) {
    case 'button':
      return <SocialAuthButton {...props} />;
    case 'link':
      return <SocialAuthLink {...props} />;
    case 'icon':
      return <SocialAuthIcon {...props} />;
    default:
      return <SocialAuthButton {...props} />;
  }
};

const styles = StyleSheet.create({
  icon: {
    color: '#3769ae'
  },
  buttonIcon: {
    color: '#fff',
    marginLeft: 10
  },
  iconWrapper: {
    alignItems: 'center',
    marginTop: 10
  },
  linkText: {
    color: '#0056b3',
    fontSize: 16,
    fontWeight: '600'
  },
  link: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3769ae',
    borderRadius: 4,
    marginBottom: 15
  },
  separator: {
    height: 30,
    width: 1.5,
    marginLeft: 10,
    backgroundColor: '#fff'
  },
  btnIconContainer: {
    flex: 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row'
  },
  btnTextContainer: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400'
  }
});

export default SocialAuthComponent;
