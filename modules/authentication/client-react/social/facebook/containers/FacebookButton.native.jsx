import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Facebook, Alert } from 'expo';
import { withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { FontAwesome } from '@expo/vector-icons';
import { lookStyles } from '@gqlapp/look-client-react-native';

import settings from '@gqlapp/config';
import authentication from '../../../index';

import LOGIN_FACEBOOK_NATIVE from '../graphql/LoginFacebookNative.graphql';

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

const facebookLogin = async client => {
  try {
    const facebookClientID = settings.auth.social.facebook.clientID;
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(facebookClientID);
    if (type === 'success') {
      await client.mutate({
        mutation: LOGIN_FACEBOOK_NATIVE,
        variables: {
          input: { accessToken: token }
        }
      });
      await authentication.doLogin(client);
    }
  } catch (error) {
    Alert.alert(`Facebook Login Failed: ${error}`);
  }
};

const FacebookButton = withApollo(({ text, client }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={() => facebookLogin(client)}>
      <View style={styles.btnIconContainer}>
        <FontAwesome name="facebook-square" size={30} style={{ color: '#fff', marginLeft: 10 }} />
        <View style={styles.separator} />
      </View>
      <View style={styles.btnTextContainer}>
        <Text style={styles.btnText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
});

const FacebookLink = withApollo(({ text, client }) => {
  return (
    <TouchableOpacity onPress={() => facebookLogin(client)} style={styles.link}>
      <Text style={styles.linkText}>{text}</Text>
    </TouchableOpacity>
  );
});

const FacebookIcon = withApollo(({ client }) => (
  <View style={styles.iconWrapper}>
    <FontAwesome name="facebook-square" size={45} style={{ color: '#3B5998' }} onPress={() => facebookLogin(client)} />
  </View>
));

class FacebookComponent extends React.Component {
  render() {
    const { type, text } = this.props;
    switch (type) {
      case 'button':
        return <FacebookButton text={text} />;
      case 'link':
        return <FacebookLink text={text} />;
      case 'icon':
        return <FacebookIcon />;
      default:
        return <FacebookButton text={text} />;
    }
  }
}

FacebookComponent.propTypes = {
  client: PropTypes.object,
  type: PropTypes.string,
  text: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  iconWrapper,
  linkText,
  link,
  buttonContainer,
  separator,
  btnIconContainer,
  btnTextContainer,
  btnText
});

export default FacebookComponent;
