import { Ionicons } from '@expo/vector-icons';
import { createTabBarIconWrapper } from '../common/components/native';
import $Module$ from './containers/$Module$';
import reducers from './reducers';

import Plugin from '../connector';

export default new Plugin({
  tabItem: {
    $Module$: {
      screen: $Module$,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        })
      }
    }
  },
  reducer: { $module$: reducers }
});
