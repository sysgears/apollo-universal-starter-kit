import { Ionicons } from '@expo/vector-icons';
import { createTabBarIconWrapper } from '../../common/components/native';
import Users from './containers/Users';
import reducers from './reducers';

import Feature from '../../connector';

export default new Feature({
  tabItem: {
    Users: {
      screen: Users,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        })
      }
    }
  },
  reducer: { users: reducers }
});
