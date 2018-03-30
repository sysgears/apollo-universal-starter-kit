import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { translate } from 'react-i18next';

import { createTabBarIconWrapper, HeaderTitle } from '../common/components/native';
import Contact from './containers/Contact';
import resources from './locales';

import Feature from '../connector';

const HeaderTitleWithI18n = translate('contact')(HeaderTitle);

export default new Feature({
  tabItem: {
    Contact: {
      screen: Contact,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        }),
        tabBarLabel: <HeaderTitleWithI18n />
      }
    }
  },
  localization: { ns: 'contact', resources }
});
