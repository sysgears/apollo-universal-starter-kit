import React from 'react';
import PropTypes from 'prop-types';
import { SimpleLineIcons, Ionicons } from '@expo/vector-icons';

import { StackNavigator } from 'react-navigation';

import translate from '../../i18n';
import access from './access';
import resolvers from './resolvers';
import resources from './locales';
import UserScreenNavigator from './containers/UserScreenNavigator';
import { HeaderTitle, MenuButton } from '../common/components/native';
import Profile from './containers/Profile';
import Login from './containers/Login';
import ForgotPassword from './containers/ForgotPassword';
import Logout from './containers/Logout';
import Register from './containers/Register';
import Users from './containers/Users';
import UserEdit from './containers/UserEdit';
import modules from '..';
import Feature from '../connector';

class LoginScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Sign In',
    header: false
  });

  render() {
    return <Login navigation={this.props.navigation} />;
  }
}

LoginScreen.propTypes = {
  navigation: PropTypes.object
};

class ForgotPasswordScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Forgot Password'
  });
  render() {
    return <ForgotPassword navigation={this.props.navigation} />;
  }
}

ForgotPasswordScreen.propTypes = {
  navigation: PropTypes.object
};

class RegisterScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Register'
  });
  render() {
    return <Register navigation={this.props.navigation} />;
  }
}

RegisterScreen.propTypes = {
  navigation: PropTypes.object
};

const AuthScreen = StackNavigator(
  {
    Login: { screen: LoginScreen },
    ForgotPassword: { screen: ForgotPasswordScreen },
    Register: { screen: RegisterScreen }
  },
  {
    cardStyle: {
      backgroundColor: '#fff'
    }
  }
);

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
    header: false
  });
  render() {
    return <Users navigation={this.props.navigation} />;
  }
}

UsersListScreen.propTypes = {
  navigation: PropTypes.object
};

class UserEditScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.id === 0 ? 'Create' : 'Edit'} user`
  });
  render() {
    return <UserEdit navigation={this.props.navigation} />;
  }
}

UserEditScreen.propTypes = {
  navigation: PropTypes.object
};

// const UsersNavigation = StackNavigator({
//   UsersList: { screen: UsersLisScreen },
//   UserEdit: { screen: UserEditScreen }
// });

class ProfileScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Profile'
  });
  render() {
    return <Profile navigation={this.props.navigation} />;
  }
}

class ProfilerEditScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Edit profile'
  });
  render() {
    return <UserEdit navigation={this.props.navigation} />;
  }
}

ProfilerEditScreen.propTypes = {
  navigation: PropTypes.object
};

ProfileScreen.propTypes = {
  navigation: PropTypes.object
};

// const ProfileNavigation = StackNavigator({
//   Profile: { screen: ProfileScreen },
//   ProfileEdit: { screen: ProfilerEditScreen }
// });

const HeaderTitleWithI18n = translate('user')(HeaderTitle);

export * from './containers/Auth';

export default new Feature(access, {
  drawerItem: {
    Profile: {
      screen: StackNavigator({
        Profile: {
          screen: Profile,
          navigationOptions: ({ navigation }) => ({
            headerTitle: <HeaderTitleWithI18n i18nKey="navLink.profile" style="subTitle" />,
            headerLeft: <MenuButton navigation={navigation} />
          })
        },
        ProfileEdit: { screen: ProfilerEditScreen }
      }),
      userInfo: {
        showOnLogin: true,
        role: ['user', 'admin']
      },
      navigationOptions: {
        drawerLabel: <HeaderTitleWithI18n i18nKey="navLink.profile" />
      }
    },
    Auth: {
      screen: AuthScreen,
      userInfo: {
        showOnLogin: false
      },
      navigationOptions: {
        drawerLabel: <HeaderTitleWithI18n i18nKey="navLink.sign" />
      }
    },
    Users: {
      screen: StackNavigator({
        UsersList: {
          screen: UsersListScreen,
          navigationOptions: ({ navigation }) => ({
            headerTitle: <HeaderTitleWithI18n i18nKey="navLink.users" style="subTitle" />,
            headerLeft: <MenuButton navigation={navigation} />
          })
        },
        UserEdit: {
          screen: UserEditScreen
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
