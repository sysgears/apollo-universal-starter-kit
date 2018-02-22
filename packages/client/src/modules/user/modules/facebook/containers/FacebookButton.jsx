import React from 'react';
import url from 'url';
import { View, StyleSheet, Linking, Button, TouchableOpacity, Text } from 'react-native';
import { SecureStore } from 'expo';
import { withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { FontAwesome } from '@expo/vector-icons';
import CURRENT_USER_QUERY from '../../jwt/graphql/CurrentUserQuery.graphql';
import { withUser, withCheckAction } from '../../../common/containers/AuthBase';

const { protocol, hostname, port } = url.parse(__BACKEND_URL__);
let serverPort = process.env.PORT || port;
if (__DEV__) {
  serverPort = '8080';
}

const facebookLogin = async () => {
  Linking.openURL(`${protocol}//${hostname}:${serverPort}/auth/facebook`);
};

const FacebookButton = () => {
  return (
    <View>
      <TouchableOpacity onPress={facebookLogin} style={styles.submit}>
        <Text style={styles.text}>Login with Facebook</Text>
      </TouchableOpacity>
    </View>
  );
};

const FacebookLink = () => {
  return <Button onPress={facebookLogin} style={{ margin: 10 }} title="Login with Facebook" />;
};

const FacebookIcon = () => {
  return (
    <View style={styles.iconWrapper}>
      <FontAwesome name="facebook-square" size={40} style={{ color: '#3B5998' }} onPress={facebookLogin} />
    </View>
  );
};

class FacebookComponent extends React.Component {
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
    const { client, refetchCurrentUser, changeAction } = this.props;
    if (decodedData.tokens) {
      await SecureStore.setItemAsync('token', decodedData.tokens.token);
      await SecureStore.setItemAsync('refreshToken', decodedData.tokens.refreshToken);
    } else if (decodedData.session) {
      await SecureStore.setItemAsync('session', decodedData.session);
    }
    const result = await refetchCurrentUser();
    if (result.data && result.data.currentUser) {
      await client.writeQuery({
        query: CURRENT_USER_QUERY,
        data: result.data
      });
      changeAction('Login');
    }
  };

  render() {
    switch (this.props.type) {
      case 'button':
        return <FacebookButton />;
      case 'link':
        return <FacebookLink />;
      case 'icon':
        return <FacebookIcon />;
      default:
        return <FacebookButton />;
    }
  }
}

FacebookComponent.propTypes = {
  client: PropTypes.object,
  type: PropTypes.string,
  refetchCurrentUser: PropTypes.func,
  changeAction: PropTypes.func
};

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

export default withCheckAction(withUser(withApollo(FacebookComponent)));
