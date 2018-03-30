import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { translate } from 'react-i18next';

// Component and helpers
import { createTabBarIconWrapper, HeaderTitle } from '../common/components/native';
import Profile from './containers/Profile';
import resolvers from './resolvers';
import resources from './locales';

import Feature from '../connector';

const HeaderTitleWithI18n = translate('user')(HeaderTitle);

export default new Feature({
  tabItem: {
    User: {
      screen: Profile,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        }),
        tabBarLabel: <HeaderTitleWithI18n i18nKey="navLink.users" />
      }
    }
  },
  resolver: resolvers,
  localization: { ns: 'user', resources }
});
