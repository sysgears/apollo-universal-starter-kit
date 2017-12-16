import { Ionicons } from '@expo/vector-icons';
import { createTabBarIconWrapper } from '../../common/components/native';
import Groups from './containers/Groups';
import reducers from './reducers';

import Feature from '../../connector';

export default new Feature({
  tabItem: {
    Groups: {
      screen: Groups,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        })
      }
    }
  },
  reducer: { groups: reducers }
});
