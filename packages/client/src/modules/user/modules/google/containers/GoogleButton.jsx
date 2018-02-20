import React from 'react';
import url from 'url';
import { View, StyleSheet, Linking, AsyncStorage, Button, TouchableOpacity, Text } from 'react-native';
import faGooglePlusSquare from '@fortawesome/fontawesome-free-brands/faGooglePlusSquare';
import { withApollo } from 'react-apollo';
import { FontAwesome } from '@expo/vector-icons';
import CURRENT_USER_QUERY from '../../jwt/graphql/CurrentUserQuery.graphql';

const { protocol, hostname, port } = url.parse(__BACKEND_URL__);
let serverPort = process.env.PORT || port;
if (__DEV__) {
  serverPort = '3000';
}

const googleLogin = () => {
  Linking.openURL(`http://192.168.0.155:8080/auth/google/`);
};

const GoogleButton = () => {
  return (
    <View>
      <TouchableOpacity onPress={googleLogin} style={styles.submit}>
        <Text style={styles.text}>Login with Facebook</Text>
      </TouchableOpacity>
    </View>
  );
};

const GoogleLink = () => {
  return <Button onPress={googleLogin} style={{ margin: 10 }} title="Login with Google" />;
};

const GoogleIcon = () => {
  return (
    <View style={styles.iconWrapper}>
      <FontAwesome name="google-plus-square" size={40} />
    </View>
  );
};

class GoogleComponent extends React.Component {
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
    if (decodedData.tokens) {
      await AsyncStorage.setItem('token', decodedData.tokens.token);
      await AsyncStorage.setItem('refreshToken', decodedData.tokens.refreshToken);
    }
    await this.props.client.writeQuery({ query: CURRENT_USER_QUERY, data: { currentUser: decodedData.user } });
  };

  render() {
    switch (this.props.type) {
      case 'button':
        return <GoogleButton />;
      case 'link':
        return <GoogleLink />;
      case 'icon':
        return <GoogleIcon />;
      default:
        return <GoogleButton />;
    }
  }
}

const styles = StyleSheet.create({
  submit: {
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    marginTop: 10,
    borderRadius: 5
  },
  text: {
    color: '#fff'
  },
  iconWrapper: {
    alignItems: 'center',
    marginTop: 10
  }
});

export default withApollo(GoogleComponent);
