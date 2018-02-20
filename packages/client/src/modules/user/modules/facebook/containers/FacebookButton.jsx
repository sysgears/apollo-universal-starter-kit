import React from 'react';
import url from 'url';
import { View, StyleSheet, Linking, AsyncStorage } from 'react-native';
import faFacebookSquare from '@fortawesome/fontawesome-free-brands/faFacebookSquare';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { Button } from '../../../../common/components/index';
import CURRENT_USER_QUERY from '../../jwt/graphql/CurrentUserQuery.graphql';
import { withUser } from '../../../common/containers/AuthBase';

const { protocol, hostname, port } = url.parse(__BACKEND_URL__);
let serverPort = process.env.PORT || port;
if (__DEV__) {
  serverPort = '8080';
}

const facebookLogin = () => {
  Linking.openURL(`${protocol}//${hostname}:${serverPort}/auth/facebook`);
};

const FacebookButton = () => {
  return (
    <View>
      <Button type="button" style={styles.submit} onPress={facebookLogin}>
        Login with Facebook
      </Button>
    </View>
  );
};

const FacebookLink = () => {
  return (
    <Button color="link" onPress={facebookLogin} style={{ margin: 10 }}>
      Login with Facebook
    </Button>
  );
};

const FacebookIcon = () => {
  return <FontAwesomeIcon icon={faFacebookSquare} size="3x" style={{ margin: 10 }} onPress={facebookLogin} />;
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
    const { client, refetchCurrentUser } = this.props;
    if (decodedData.tokens) {
      await AsyncStorage.setItem('token', decodedData.tokens.token);
      await AsyncStorage.setItem('refreshToken', decodedData.tokens.refreshToken);
    } else if (decodedData.session) {
      await AsyncStorage.setItem('session', decodedData.session);
    }
    const { data: { currentUser } } = await refetchCurrentUser();
    await client.writeQuery({
      query: CURRENT_USER_QUERY,
      data: { currentUser }
    });
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
  submit: {
    marginTop: 10,
    alignSelf: 'center'
  }
});

export default withUser(withApollo(FacebookComponent));
