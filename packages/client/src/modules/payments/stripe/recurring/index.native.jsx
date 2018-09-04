import React from 'react';
import { createStackNavigator } from 'react-navigation';

import translate from '../../../../i18n';
import { HeaderTitle, IconButton } from '../../../common/components/native';
import SubscriberPage from './containers/SubscriberPage';
import resources from './locales';

import Feature from '../../../connector';

const HeaderTitleWithI18n = translate('subscription')(HeaderTitle);

export default new Feature({
  drawerItem: {
    StripeSubscription: {
      screen: createStackNavigator({
        SubscriberPage: {
          screen: SubscriberPage,
          navigationOptions: ({ navigation }) => ({
            headerTitle: <HeaderTitleWithI18n style="subTitle" />,
            headerLeft: (
              <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
            )
          })
        }
      }),
      userInfo: {
        showOnLogin: true,
        role: ['user']
      },
      navigationOptions: {
        drawerLabel: <HeaderTitleWithI18n />
      }
    }
  },
  localization: { ns: 'subscription', resources }
});
