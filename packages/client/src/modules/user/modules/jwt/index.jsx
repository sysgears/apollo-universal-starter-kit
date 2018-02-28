import React from 'react';
import PropTypes from 'prop-types';
import { SimpleLineIcons, Ionicons } from '@expo/vector-icons';
import { SecureStore } from 'expo';

import { createTabBarIconWrapper } from '../../../common/components/native';
import Profile from './containers/Profile';
import Login from './containers/Login';
import Logout from '../../common/containers/Logout';
import UsersList from '../../common/containers/UsersList';

import Feature from '../../../connector';

async function tokenMiddleware(req, options, next) {
  options.headers['x-token'] = await SecureStore.getItemAsync('token');
  options.headers['x-refresh-token'] = await SecureStore.getItemAsync('refreshToken');
  next();
}

async function tokenAfterware(res, options, next) {
  const token = options.headers['x-token'];
  const refreshToken = options.headers['x-refresh-token'];
  if (token) {
    await SecureStore.setItemAsync('token', token);
  }
  if (refreshToken) {
    await SecureStore.setItemAsync('refreshToken', refreshToken);
  }
  next();
}

async function connectionParam() {
  return {
    token: await SecureStore.getItemAsync('token'),
    refreshToken: await SecureStore.getItemAsync('refreshToken')
  };
}

class LoginScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Sign In'
  });
  render() {
    return <Login navigation={this.props.navigation} />;
  }
}

LoginScreen.propTypes = {
  navigation: PropTypes.object
};

class LogoutScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Logout'
  });
  render() {
    return <Logout navigation={this.props.navigation} />;
  }
}

LogoutScreen.propTypes = {
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

export default new Feature({
  tabItem: {
    Profile: {
      screen: ProfileScreen,
      userInfo: {
        showOnLogin: true
      },
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(SimpleLineIcons, {
          name: 'user',
          size: 30
        })
      }
    },
    Login: {
      screen: LoginScreen,
      userInfo: {
        showOnLogin: false
      },
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(SimpleLineIcons, {
          name: 'login',
          size: 30
        })
      }
    },
    Users: {
      screen: UsersLisScreen,
      userInfo: {
        showOnLogin: true,
        role: 'admin'
      },
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        })
      }
    },
    Logout: {
      screen: LogoutScreen,
      userInfo: {
        showOnLogin: true
      },
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(SimpleLineIcons, {
          name: 'logout',
          size: 30
        })
      }
    }
  },
  middleware: tokenMiddleware,
  afterware: tokenAfterware,
  connectionParam: connectionParam
});
