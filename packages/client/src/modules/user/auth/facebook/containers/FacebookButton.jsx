import React from 'react';
import { View, StyleSheet, Linking, Button, TouchableOpacity, Text, Platform } from 'react-native';
import { SecureStore, WebBrowser } from 'expo';
import { withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { FontAwesome } from '@expo/vector-icons';
import CURRENT_USER_QUERY from '../../../graphql/CurrentUserQuery.graphql';
import { withUser, withCheckAction } from '../../../containers/AuthBase';
import buildRedirectUrlForMobile from '../../../helpers';

const facebookLogin = () => {
  const url = buildRedirectUrlForMobile('facebook');
  if (Platform.OS === 'ios') {
    WebBrowser.openBrowserAsync(url);
  } else {
    Linking.openURL(url);
  }
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
      await SecureStore.setItemAsync('accessToken', decodedData.tokens.accessToken);
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
    if (Platform.OS === 'ios') {
      WebBrowser.dismissBrowser();
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
