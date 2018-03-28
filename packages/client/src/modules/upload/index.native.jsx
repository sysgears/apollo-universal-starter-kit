// Ionicons
import { Ionicons } from '@expo/vector-icons';

// Component and helpers
import { createTabBarIconWrapper } from '../common/components/native';
import Upload from './containers/Upload';
import reducers from './reducers';
import resources from './locales';

import Feature from '../connector';

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
  },
  reducer: { upload: reducers },
  localization: { ns: 'upload', resources }
});
