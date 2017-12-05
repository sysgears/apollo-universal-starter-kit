// Ionicons
import { Ionicons } from '@expo/vector-icons';

// Component and helpers
import { createTabBarIconWrapper } from '../common/components/native';
import Subscription from './containers/Subscription';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  tabItem: {
    $Module$: {
      screen: Subscription,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        })
      }
    }
  },
  reducer: { subscription: reducers }
});
