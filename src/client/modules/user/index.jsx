import React from 'react';
import PropTypes from 'prop-types';
import { SimpleLineIcons } from '@expo/vector-icons';
import { StackNavigator } from 'react-navigation';

import { createTabBarIconWrapper } from '../common/components/native';
import Profile from './containers/Profile';
import Login from './containers/Login';
import reducers from './reducers';

import Feature from '../connector';

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
    }
  },
  reducer: { user: reducers }
});
