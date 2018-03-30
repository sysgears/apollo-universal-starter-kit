import React from 'react';
import PropTypes from 'prop-types';
import { SimpleLineIcons, Ionicons } from '@expo/vector-icons';
import { translate } from 'react-i18next';

import auth from './auth';
import resolvers from './resolvers';
import resources from './locales';
import UserScreenNavigator from './containers/UserScreenNavigator';
import { createTabBarIconWrapper, HeaderTitle } from '../common/components/native';
import Profile from './containers/Profile';
import Login from './containers/Login';
import Logout from './containers/Logout';
import UsersList from './containers/UsersList';
import modules from '..';
import Feature from '../connector';

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

const HeaderTitleWithI18n = translate('user')(HeaderTitle);

export * from './containers/Auth';

export default new Feature(auth, {
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
        }),
        tabBarLabel: <HeaderTitleWithI18n i18nKey="navLink.profile" />
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
        }),
        tabBarLabel: <HeaderTitleWithI18n i18nKey="navLink.sign" />
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
        }),
        tabBarLabel: <HeaderTitleWithI18n i18nKey="navLink.users" />
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
        }),
        tabBarLabel: <HeaderTitleWithI18n i18nKey="navLink.logout" />
      }
    }
  },
  resolver: resolvers,
  localization: { ns: 'user', resources },
  routerFactory: () => {
    return UserScreenNavigator(modules.tabItems);
  }
});
