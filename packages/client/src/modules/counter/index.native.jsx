import React from 'react';
import { createStackNavigator } from 'react-navigation';

import translate from '../../i18n';
import { HeaderTitle, IconButton } from '../common/components/native';
import Counter from './containers/Counter';
import ClientCounter from './clientCounter';
import ReduxCounter from './reduxCounter';
import ServerCounter from './serverCounter';
import Feature from '../connector';
import ClientCounterContainer from './clientCounter/containers/ClientCounter';
import ServerCounterContainer from './serverCounter/containers/ServerCounter';
import ReduxCounterContainer from './reduxCounter/containers/ReduxCounter';

const HeaderTitleWithI18n = translate('counter')(HeaderTitle);

export default new Feature(ClientCounter, ReduxCounter, ServerCounter, {
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

export { ClientCounterContainer, ServerCounterContainer, ReduxCounterContainer };
