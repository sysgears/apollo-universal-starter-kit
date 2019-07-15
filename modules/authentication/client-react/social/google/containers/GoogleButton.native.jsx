import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Linking, TouchableOpacity, Text, Platform } from 'react-native';
import { WebBrowser } from 'expo';
import { withApollo } from 'react-apollo';
import { FontAwesome } from '@expo/vector-icons';
import { lookStyles } from '@gqlapp/look-client-react-native';

import buildRedirectUrlForMobile from '../../../helpers';

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

const GoogleButton = withApollo(({ text }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={googleLogin}>
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
