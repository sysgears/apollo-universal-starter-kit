// Ionicons
import { Ionicons } from '@expo/vector-icons';

// Component and helpers
import { createTabBarIconWrapper } from '../common/components';
import User from './containers/user';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  tabItem: {
    User: {
      screen: User,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        })
      }
    }
  },
  reducer: { user: reducers }
});
