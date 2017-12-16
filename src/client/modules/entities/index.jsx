import { Ionicons } from '@expo/vector-icons';
import { createTabBarIconWrapper } from '../common/components/native';
import Entities from './containers/Entities';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  tabItem: {
    Entities: {
      screen: Entities,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        })
      }
    }
  },
  reducer: { entities: reducers }
});
