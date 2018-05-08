import React from 'react';
import PropTypes from 'prop-types';
import { createStackNavigator } from 'react-navigation';

import translate from '../../i18n';
import access from './access';
import resolvers from './resolvers';
import resources from './locales';
import UserScreenNavigator from './containers/UserScreenNavigator';
import { HeaderTitle, MenuButton } from '../common/components/native';
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

const HeaderTitleWithI18n = translate('user')(HeaderTitle);

export * from './containers/Auth';

export default new Feature(access, {
  drawerItem: {
    Profile: {
      screen: createStackNavigator({
        Profile: {
          screen: Profile,
          navigationOptions: ({ navigation }) => ({
            headerTitle: <HeaderTitleWithI18n i18nKey="navLink.profile" style="subTitle" />,
            headerLeft: <MenuButton navigation={navigation} />
          })
        }
      }),
      userInfo: {
        showOnLogin: true,
        role: ['user', 'admin']
      },
      navigationOptions: {
        drawerLabel: <HeaderTitleWithI18n i18nKey="navLink.profile" />
      }
    },
    Login: {
      screen: LoginScreen,
      userInfo: {
        showOnLogin: false
      },
      navigationOptions: {
        drawerLabel: <HeaderTitleWithI18n i18nKey="navLink.sign" />
      }
    },
    Users: {
      screen: createStackNavigator({
        Users: {
          screen: UsersListScreen,
          navigationOptions: ({ navigation }) => ({
            headerTitle: <HeaderTitleWithI18n i18nKey="navLink.users" style="subTitle" />,
            headerLeft: <MenuButton navigation={navigation} />
          })
        }
      }),
      userInfo: {
        showOnLogin: true,
        role: 'admin'
      },
      navigationOptions: {
        drawerLabel: <HeaderTitleWithI18n i18nKey="navLink.users" />
      }
    },
    Logout: {
      screen: LogoutScreen,
      userInfo: {
        showOnLogin: true
      },
      navigationOptions: {
        drawerLabel: <HeaderTitleWithI18n i18nKey="navLink.logout" />
      }
    }
  },
  resolver: resolvers,
  localization: { ns: 'user', resources },
  routerFactory: () => {
    return UserScreenNavigator(modules.drawerItems);
  }
});
