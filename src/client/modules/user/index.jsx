import { AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createTabBarIconWrapper } from '../common/components/native';
import Profile from './containers/Profile';
import reducers from './reducers';

import Feature from '../connector';

function tokenMiddleware(req, options) {
  AsyncStorage;
  options.headers['x-token'] = window.localStorage.getItem('token');
  options.headers['x-refresh-token'] = window.localStorage.getItem('refreshToken');
}

function tokenAfterware(res, options) {
  const token = options.headers['x-token'];
  const refreshToken = options.headers['x-refresh-token'];
  if (token) {
    window.localStorage.setItem('token', token);
  }
  if (refreshToken) {
    window.localStorage.setItem('refreshToken', refreshToken);
  }
}

function connectionParam() {
  return {
    token: window.localStorage.getItem('token'),
    refreshToken: window.localStorage.getItem('refreshToken')
  };
}

export default new Feature({
  tabItem: {
    User: {
      screen: Profile,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
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
