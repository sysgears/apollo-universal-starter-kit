import React from 'react';
import { translate } from 'react-i18next';
import { StackNavigator } from 'react-navigation';

import { HeaderTitle, MenuButton } from '../common/components/native';
import Contact from './containers/Contact';
import resources from './locales';

import Feature from '../connector';

const HeaderTitleWithI18n = translate('contact')(HeaderTitle);

export default new Feature({
  drawerItem: {
    Contact: {
      screen: StackNavigator({
        Contact: {
          screen: Contact,
          navigationOptions: ({ navigation }) => ({
            headerTitle: <HeaderTitleWithI18n i18nKey="title" style="subTitle" />,
            headerLeft: <MenuButton navigation={navigation} />
          })
        }
      }),
      navigationOptions: {
        drawerLabel: <HeaderTitleWithI18n />
      }
    }
  },
  localization: { ns: 'contact', resources }
});
