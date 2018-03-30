import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { translate } from 'react-i18next';

import { createTabBarIconWrapper, HeaderTitle } from '../common/components/native';
import Counter from './containers/Counter';
import reducers from './reducers';
import resolvers from './resolvers';
import resources from './locales';

import Feature from '../connector';

const HeaderTitleWithI18n = translate('counter')(HeaderTitle);

export default new Feature({
  tabItem: {
    Counter: {
      screen: Counter,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-home-outline',
          size: 30
        }),
        tabBarLabel: <HeaderTitleWithI18n i18nKey="title" />
      }
    }
  },
  resolver: resolvers,
  reducer: { counter: reducers },
  localization: { ns: 'counter', resources }
});
