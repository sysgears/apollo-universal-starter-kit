import React from 'react';
import PropTypes from 'prop-types';
import { SimpleLineIcons } from '@expo/vector-icons';
import { StackNavigator } from 'react-navigation';
import { AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { createTabBarIconWrapper } from '../../../common/components/native';
import Profile from './containers/Profile';
import Login from './containers/Login';
import UsersList from './containers/UsersList';
import resolvers from './resolvers';

import Feature from '../../../connector';

async function tokenMiddleware(req, options, next) {
  options.headers['x-token'] = await AsyncStorage.getItem('token');
  options.headers['x-refresh-token'] = await AsyncStorage.getItem('refreshToken');
  next();
}

async function tokenAfterware(res, options, next) {
  const token = options.headers['x-token'];
  const refreshToken = options.headers['x-refresh-token'];
  if (token) {
    await AsyncStorage.setItem('token', token);
  }
  if (refreshToken) {
    await AsyncStorage.setItem('refreshToken', refreshToken);
  }
  next();
}

async function connectionParam() {
  return {
    token: await AsyncStorage.getItem('token'),
    refreshToken: await AsyncStorage.getItem('refreshToken')
  };
}

class LoginScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Sign In'
  });
  render() {
    return <Login navigation={this.props.navigation} onLogin={() => this.props.navigation.navigate('Profile')} />;
  }
}

LoginScreen.propTypes = {
  navigation: PropTypes.object
};

class UsersLisScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Users'
  });
  render() {
    return <UsersList navigation={this.props.navigation} />;
  }
}

UsersLisScreen.propTypes = {
  navigation: PropTypes.object
};

class ProfileScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Profile'
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
    },
    Users: {
      screen: UsersLisScreen,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        }),
        tabBarOptions: {
          showLabel: false
        }
      },
      onPress: () => console.log('===============================PRESS')
    }
  },
  resolver: resolvers,
  middleware: tokenMiddleware,
  afterware: tokenAfterware,
  connectionParam: connectionParam
});
