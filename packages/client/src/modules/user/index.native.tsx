// Ionicons
import Ionicons from '@expo/vector-icons/Ionicons';

// Component and helpers
import { createTabBarIconWrapper } from '../common/components/native';
import Profile from './containers/Profile';
import resolvers from './resolvers';

import Feature from '../connector.native';

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
  resolvers
});
