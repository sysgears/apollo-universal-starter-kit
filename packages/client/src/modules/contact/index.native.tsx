import Ionicons from '@expo/vector-icons/Ionicons';
import { createTabBarIconWrapper } from '../common/components/native';
import Contact from './containers/Contact.native';

import Feature from '../connector.native';

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
