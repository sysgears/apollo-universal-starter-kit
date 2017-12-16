import { Ionicons } from '@expo/vector-icons';
import { createTabBarIconWrapper } from '../../common/components/native';
import Orgs from './containers/Orgs';
import reducers from './reducers';

import Feature from '../../connector';

export default new Feature({
  tabItem: {
    Orgs: {
      screen: Orgs,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        })
      }
    }
  },
  reducer: { orgs: reducers }
});
