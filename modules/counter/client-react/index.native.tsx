import React from 'react';
import { createStackNavigator } from 'react-navigation';

import { translate } from '@gqlapp/i18n-client-react';
import { HeaderTitle, IconButton } from '@gqlapp/look-client-react-native';
import ClientModule from '@gqlapp/module-client-react-native';

import Counter from './containers/Counter';
import counters from './counters';
import resources from './locales';

const HeaderTitleWithI18n = translate('counter')(HeaderTitle);

export default new ClientModule(counters, {
  drawerItem: [
    {
      Counter: {
        screen: createStackNavigator({
          Counter: {
            screen: Counter,
            navigationOptions: ({ navigation }: any) => ({
              headerTitle: <HeaderTitleWithI18n i18nKey="title" style="subTitle" />,
              headerLeft: (
                <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
              ),
              headerStyle: { backgroundColor: '#fff' },
              headerForceInset: {}
            })
          }
        }),
        navigationOptions: {
          drawerLabel: <HeaderTitleWithI18n i18nKey="title" />
        }
      }
    }
  ],
  localization: [{ ns: 'counter', resources }]
});
