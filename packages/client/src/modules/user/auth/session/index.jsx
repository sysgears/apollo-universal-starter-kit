import React from 'react';
import PropTypes from 'prop-types';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { SecureStore } from 'expo';

import { createTabBarIconWrapper } from '../../../common/components/native';
import Profile from '../../containers/Profile';
import Login from './containers/Login';
import Logout from '../../containers/Logout';
import UsersList from '../../containers/UsersList';

import Feature from '../../../connector';

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

class UsersListScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Users'
  });
  render() {
    return <UsersList navigation={this.props.navigation} />;
  }
}

UsersListScreen.propTypes = {
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

async function tokenMiddleware(req, options, next) {
  if (__CLIENT__) {
    options.headers = { 'X-Token': window.__CSRF_TOKEN__ };
  }
  const session = await SecureStore.getItemAsync('session');
  if (session) {
    options.headers = { session };
  }
  next();
}

export default new Feature({
  tabItem: {
    Profile: {
      screen: ProfileScreen,
      userInfo: {
        showOnLogin: true,
        role: ['user', 'admin']
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
      screen: UsersListScreen,
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
  middleware: tokenMiddleware
});
