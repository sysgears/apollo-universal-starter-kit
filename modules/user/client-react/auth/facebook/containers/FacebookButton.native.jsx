import React from 'react';
import { View, StyleSheet, Linking, TouchableOpacity, Text, Platform } from 'react-native';
import { WebBrowser } from 'expo';
import { withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { FontAwesome } from '@expo/vector-icons';
import {
  iconWrapper,
  linkText,
  link,
  buttonContainer,
  separator,
  btnIconContainer,
  btnTextContainer,
  btnText
} from '@gqlapp/look-client-react-native/styles';

import buildRedirectUrlForMobile from '../../../helpers';

const facebookLogin = () => {
  const url = buildRedirectUrlForMobile('facebook');
  if (Platform.OS === 'ios') {
    WebBrowser.openBrowserAsync(url);
  } else {
    Linking.openURL(url);
  }
};

const FacebookButton = withApollo(({ text }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={facebookLogin}>
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

const FacebookLink = withApollo(({ text }) => {
  return (
    <TouchableOpacity onPress={facebookLogin} style={styles.link}>
      <Text style={styles.linkText}>{text}</Text>
    </TouchableOpacity>
  );
});

const FacebookIcon = () => (
  <View style={styles.iconWrapper}>
    <FontAwesome name="facebook-square" size={45} style={{ color: '#3B5998' }} onPress={facebookLogin} />
  </View>
);

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
