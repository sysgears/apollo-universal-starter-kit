import { Ionicons } from '@expo/vector-icons';
import { createTabBarIconWrapper } from '../../common/components/native';
import ServiceAccounts from './containers/ServiceAccounts';
import reducers from './reducers';

import Feature from '../../connector';

export default new Feature({
  tabItem: {
    ServiceAccounts: {
      screen: ServiceAccounts,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        })
      }
    }
  },
  reducer: { serviceaccounts: reducers }
});
