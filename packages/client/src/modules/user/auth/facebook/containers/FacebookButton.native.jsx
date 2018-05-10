import React from 'react';
import { View, StyleSheet, Linking, TouchableOpacity, Text, Platform } from 'react-native';
import { WebBrowser } from 'expo';
import { withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { FontAwesome } from '@expo/vector-icons';

import { setItem } from '../../../../common/clientStorage';
import CURRENT_USER_QUERY from '../../../graphql/CurrentUserQuery.graphql';
import { withUser } from '../../../containers/Auth';
import buildRedirectUrlForMobile from '../../../helpers';
import access from '../../../access';
import { Button, primary } from '../../../../common/components/native';
import { iconWrapper, linkText, link } from '../../../../common/components/native/styles';

const facebookLogin = () => {
  const url = buildRedirectUrlForMobile('facebook');
  if (Platform.OS === 'ios') {
    WebBrowser.openBrowserAsync(url);
  } else {
    Linking.openURL(url);
  }
};

const FacebookButton = withApollo(({ client }) => {
  return (
    <View>
      <Button onPress={() => access.doLogin(client).then(facebookLogin)} type={primary}>
        Login with Facebook
      </Button>
    </View>
  );
});

const FacebookLink = withApollo(({ client }) => {
  return (
    <TouchableOpacity onPress={() => access.doLogin(client).then(facebookLogin)} style={styles.link}>
      <Text style={styles.linkText}>Login with Facebook</Text>
    </TouchableOpacity>
  );
});

const FacebookIcon = withApollo(({ client }) => {
  return (
    <View style={styles.iconWrapper}>
      <FontAwesome
        name="facebook-square"
        size={40}
        style={{ color: '#3B5998' }}
        onPress={() => access.doLogin(client).then(facebookLogin)}
      />
    </View>
  );
});

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
  refetchCurrentUser: PropTypes.func
};

const styles = StyleSheet.create({
  iconWrapper,
  linkText,
  link
});

export default withUser(withApollo(FacebookComponent));
