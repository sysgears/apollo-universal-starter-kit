import { Ionicons } from '@expo/vector-icons';
import { createTabBarIconWrapper } from '../common/components/native';
import Contact from './containers/Contact';

import Feature from '../connector';

export default new Feature({
  tabItem: {
    Contact: {
      screen: Contact,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        })
      }
    }
  }
});
