import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Linking, TouchableOpacity, Text, Platform } from 'react-native';
import { WebBrowser } from 'expo';
import { withApollo } from 'react-apollo';
import { FontAwesome } from '@expo/vector-icons';

import { setItem } from '../../../../common/clientStorage';
import CURRENT_USER_QUERY from '../../../graphql/CurrentUserQuery.graphql';
import { withUser } from '../../../containers/Auth';
import buildRedirectUrlForMobile from '../../../helpers';
import access from '../../../access';
import { Button, primary } from '../../../../common/components/native';
import { iconWrapper, linkText, link } from '../../../../common/components/native/styles';

const googleLogin = () => {
  const url = buildRedirectUrlForMobile('google');
  if (Platform.OS === 'ios') {
    WebBrowser.openBrowserAsync(url);
  } else {
    Linking.openURL(url);
  }
};

const GoogleButton = withApollo(({ client }) => {
  return (
    <View style={{ marginTop: 15 }}>
      <Button onPress={() => access.doLogin(client).then(googleLogin)} type={primary}>
        Login with Google
      </Button>
    </View>
  );
});

const GoogleLink = withApollo(({ client }) => {
  return (
    <TouchableOpacity onPress={() => access.doLogin(client).then(googleLogin)} style={styles.link}>
      <Text style={styles.linkText}>Login with Google</Text>
    </TouchableOpacity>
  );
});

const GoogleIcon = withApollo(({ client }) => {
  return (
    <View style={styles.iconWrapper}>
      <FontAwesome onPress={() => access.doLogin(client).then(googleLogin)} name="google-plus-square" size={40} />
    </View>
  );
});

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
    const { client, refetchCurrentUser } = this.props;
    if (decodedData.tokens) {
      await setItem('accessToken', decodedData.tokens.accessToken);
      await setItem('refreshToken', decodedData.tokens.refreshToken);
    }
    const result = await refetchCurrentUser();
    if (result.data && result.data.currentUser) {
      await client.writeQuery({
        query: CURRENT_USER_QUERY,
        data: result.data
      });
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
  writeQuery: PropTypes.func
};

const styles = StyleSheet.create({
  iconWrapper,
  linkText,
  link
});

export default withUser(withApollo(GoogleComponent));
