import React from 'react';
import { createStackNavigator } from 'react-navigation';

import translate from '../../i18n';
import { HeaderTitle, MenuButton } from '../common/components/native';
import Contact from './containers/Contact';
import resources from './locales';

import Feature from '../connector';

const HeaderTitleWithI18n = translate('contact')(HeaderTitle);

export default new Feature({
  drawerItem: {
    Contact: {
      screen: createStackNavigator({
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
