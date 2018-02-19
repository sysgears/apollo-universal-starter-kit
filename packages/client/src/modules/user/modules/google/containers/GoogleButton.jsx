import React from 'react';
import url from 'url';
import { View, StyleSheet, Linking, AsyncStorage } from 'react-native';
import faGooglePlusSquare from '@fortawesome/fontawesome-free-brands/faGooglePlusSquare';
import { withApollo } from 'react-apollo';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Button } from '../../../../common/components/index';
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
      <Button type="button" style={styles.submit} onPress={googleLogin}>
        Login with Google
      </Button>
    </View>
  );
};

const GoogleLink = () => {
  return (
    <Button color="link" onPress={googleLogin} style={{ margin: 10 }}>
      Login with Google
    </Button>
  );
};

const GoogleIcon = () => {
  return <FontAwesomeIcon icon={faGooglePlusSquare} size="3x" style={{ margin: 10 }} onPress={googleLogin} />;
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
    const decodedData = JSON.parse(decodeURI(data))
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
    marginTop: 10,
    alignSelf: 'center'
  }
});

export default withApollo(GoogleComponent);
