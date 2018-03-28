// Ionicons
import Ionicons from '@expo/vector-icons/Ionicons';

// Component and helpers
import { createTabBarIconWrapper } from '../common/components/native';
import Upload from './containers/Upload.native';

import Feature from '../connector.native';

export default new Feature({
  catalogInfo: { upload: true },
  tabItem: {
    Upload: {
      screen: Upload,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        })
      }
    }
  }
});
