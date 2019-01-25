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

const linkedInLogin = () => {
  const url = buildRedirectUrlForMobile('linkedin');
  if (Platform.OS === 'ios') {
    WebBrowser.openBrowserAsync(url);
  } else {
    Linking.openURL(url);
  }
};

const LinkedInButton = withApollo(({ text }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={linkedInLogin}>
      <View style={styles.btnIconContainer}>
        <FontAwesome name="linkedin-square" size={30} style={{ color: '#fff', marginLeft: 10 }} />
        <View style={styles.separator} />
      </View>
      <View style={styles.btnTextContainer}>
        <Text style={styles.btnText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
});

const LinkedInLink = withApollo(({ text }) => {
  return (
    <TouchableOpacity onPress={linkedInLogin} style={styles.link}>
      <Text style={styles.linkText}>{text}</Text>
    </TouchableOpacity>
  );
});

const LinkedInIcon = () => (
  <View style={styles.iconWrapper}>
    <FontAwesome name="linkedin-square" size={45} style={{ color: '#3B5998' }} onPress={linkedInLogin} />
  </View>
);

class LinkedInComponent extends React.Component {
  render() {
    const { type, text } = this.props;
    switch (type) {
      case 'button':
        return <LinkedInButton text={text} />;
      case 'link':
        return <LinkedInLink text={text} />;
      case 'icon':
        return <LinkedInIcon />;
      default:
        return <LinkedInButton text={text} />;
    }
  }
}

LinkedInComponent.propTypes = {
  client: PropTypes.object,
  type: PropTypes.string,
  text: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  iconWrapper,
  linkText,
  link,
  buttonContainer: {
    ...buttonContainer,
    marginTop: 15,
    backgroundColor: '#0077b0'
  },
  separator,
  btnIconContainer,
  btnTextContainer,
  btnText
});

export default LinkedInComponent;
