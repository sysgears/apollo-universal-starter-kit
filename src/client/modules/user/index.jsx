import React from 'react';
import PropTypes from 'prop-types';
import Expo from 'expo';
import { Button } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import { StackNavigator } from 'react-navigation';

import { createTabBarIconWrapper } from '../common/components/native';
import Profile from './containers/Profile';
import Login from './containers/Login';
import reducers from './reducers';

import Feature from '../connector';

const tokenMiddleware = async (req, options, next) => {
  options.headers['x-token'] = await Expo.SecureStore.getItemAsync('token');
  options.headers['x-refresh-token'] = await Expo.SecureStore.getItemAsync('refreshToken');
  next();
};

const tokenAfterware = async (res, options, next) => {
  const token = options.headers['x-token'];
  const refreshToken = options.headers['x-refresh-token'];
  if (token) {
    await Expo.SecureStore.setItemAsync('token', token);
  }
  if (refreshToken) {
    await Expo.SecureStore.setItemAsync('refreshToken', refreshToken);
  }
  next();
};

const connectionParam = async () => {
  return {
    token: await Expo.SecureStore.getItemAsync('token'),
    refreshToken: await Expo.SecureStore.getItemAsync('refreshToken')
  };
};

class LoginScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Login',
    headerRight: <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
  });
  render() {
    return <Login navigation={this.props.navigation} />;
  }
}

LoginScreen.propTypes = {
  navigation: PropTypes.object
};

class ProfileScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Profile',
    headerRight: <Button title="Login" onPress={() => navigation.navigate('Login')} />
  });
  render() {
    return <Profile navigation={this.props.navigation} />;
  }
}

ProfileScreen.propTypes = {
  navigation: PropTypes.object
};

const LoginNavigator = StackNavigator({
  Login: { screen: LoginScreen },
  Profile: { screen: ProfileScreen }
});

export default new Feature({
  tabItem: {
    User: {
      screen: LoginNavigator,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(SimpleLineIcons, {
          name: 'user',
          size: 30
        })
      }
    }
  },
  reducer: { user: reducers },
  middleware: tokenMiddleware,
  afterware: tokenAfterware,
  connectionParam: connectionParam
});
