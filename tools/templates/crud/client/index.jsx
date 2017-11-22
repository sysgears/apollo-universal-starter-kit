import { Ionicons } from '@expo/vector-icons';
import { createTabBarIconWrapper } from '../common/components/native';
import $Module$List from './containers/$Module$List';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  tabItem: {
    $Module$: {
      screen: $Module$List,
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
