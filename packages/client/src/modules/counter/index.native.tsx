import React from 'react';
import { createStackNavigator } from 'react-navigation';

import translate from '../../i18n';
import { HeaderTitle, IconButton } from '../common/components/native';
import Counter from './containers/Counter';
import clientCounter from './clientCounter';
import reduxCounter from './reduxCounter';
import serverCounter from './serverCounter';
import Feature from '../connector';

const HeaderTitleWithI18n = translate('counter')(HeaderTitle);

export default new Feature(clientCounter, reduxCounter, serverCounter, {
  drawerItem: {
    Counter: {
      screen: createStackNavigator({
        Counter: {
          screen: Counter,
          navigationOptions: ({ navigation }) => ({
            headerTitle: <HeaderTitleWithI18n i18nKey="title" style="subTitle" />,
            headerLeft: (
              <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
            ),
            headerStyle: { backgroundColor: '#fff' }
          })
        }
      }),
      navigationOptions: {
        drawerLabel: <HeaderTitleWithI18n i18nKey="title" />
      }
    }
  }
});
