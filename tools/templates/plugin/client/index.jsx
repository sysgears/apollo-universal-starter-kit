import { Ionicons } from '@expo/vector-icons';
import { createTabBarIconWrapper } from '../common/components/native';
import $Plugin$ from './containers/$Plugin$';
import reducers from './reducers';

import Plugin from '../plugin';

export default new Plugin({
  tabItem: {
    $Plugin$: {
      screen: $Plugin$,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        })
      }
    }
  },
  reducer: { $plugin$: reducers }
});
