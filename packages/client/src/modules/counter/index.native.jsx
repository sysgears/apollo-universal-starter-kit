import React from 'react';
import { createStackNavigator } from 'react-navigation';

import translate from '../../i18n';
import { HeaderTitle, IconButton } from '../common/components/native';
import Counter from './containers/Counter';
import reducers from './reducers';
import resolvers from './resolvers';
import resources from './locales';

import Feature from '../connector';

const HeaderTitleWithI18n = translate('counter')(HeaderTitle);

export default new Feature({
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
  },
  resolver: resolvers,
  reducer: { counter: reducers },
  localization: { ns: 'counter', resources }
});
