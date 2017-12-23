// Ionicons
import { Ionicons } from '@expo/vector-icons';

// Component and helpers
import { createTabBarIconWrapper } from '../common/components/native';
import Profile from './containers/Profile';
import reducers from './reducers';

import Plugin from '../plugin';

export default new Plugin({
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
  reducer: { user: reducers }
});
