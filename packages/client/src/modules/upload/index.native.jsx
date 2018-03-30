import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { translate } from 'react-i18next';

// Component and helpers
import { createTabBarIconWrapper, HeaderTitle } from '../common/components/native';
import Upload from './containers/Upload';
import reducers from './reducers';
import resources from './locales';

import Feature from '../connector';

const HeaderTitleWithI18n = translate('upload')(HeaderTitle);

export default new Feature({
  catalogInfo: { upload: true },
  tabItem: {
    Upload: {
      screen: Upload,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        }),
        tabBarLabel: <HeaderTitleWithI18n />
      }
    }
  },
  reducer: { upload: reducers },
  localization: { ns: 'upload', resources }
});
