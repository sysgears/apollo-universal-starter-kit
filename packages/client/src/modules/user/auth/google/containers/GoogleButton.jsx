import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Linking, Button, TouchableOpacity, Text, Platform } from 'react-native';
import { SecureStore, WebBrowser } from 'expo';
import { withApollo } from 'react-apollo';
import { FontAwesome } from '@expo/vector-icons';
import CURRENT_USER_QUERY from '../../../graphql/CurrentUserQuery.graphql';
import { withUser, withCheckAction } from '../../../containers/AuthBase';
import buildRedirectUrlForMobile from '../../../helpers';

const googleLogin = () => {
  const url = buildRedirectUrlForMobile('google');
  if (Platform.OS === 'ios') {
    WebBrowser.openBrowserAsync(url);
  } else {
    Linking.openURL(url);
  }
};

const GoogleButton = () => {
  return (
    <View>
      <TouchableOpacity onPress={googleLogin} style={styles.submit}>
        <Text style={styles.text}>Login with Google</Text>
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
      <FontAwesome onPress={googleLogin} name="google-plus-square" size={40} />
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
    const { client, refetchCurrentUser, changeAction } = this.props;
    if (decodedData.tokens) {
      await SecureStore.setItemAsync('token', decodedData.tokens.token);
      await SecureStore.setItemAsync('refreshToken', decodedData.tokens.refreshToken);
    }
    const result = await refetchCurrentUser();
    if (result.data && result.data.currentUser) {
      await client.writeQuery({
        query: CURRENT_USER_QUERY,
        data: result.data
      });
      changeAction('Login');
    }
    if (Platform.OS === 'ios') {
      WebBrowser.dismissBrowser();
    }
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

GoogleComponent.propTypes = {
  client: PropTypes.object,
  type: PropTypes.string,
  writeQuery: PropTypes.func,
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

export default withCheckAction(withUser(withApollo(GoogleComponent)));
