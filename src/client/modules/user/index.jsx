import Expo from 'expo';
import { Ionicons } from '@expo/vector-icons';

import { createTabBarIconWrapper } from '../common/components/native';
import Profile from './containers/Profile';
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
