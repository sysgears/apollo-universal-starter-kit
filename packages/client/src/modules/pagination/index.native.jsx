import React from 'react';
import { createStackNavigator } from 'react-navigation';

import translate from '../../i18n';
import { HeaderTitle, IconButton } from '../common/components/native';
import Pagination from './containers/Pagination';
import resources from './locales';

import Feature from '../connector';

const HeaderTitleWithI18n = translate('pagination')(HeaderTitle);

export default new Feature({
  drawerItem: {
    Pagination: {
      screen: createStackNavigator({
        Pagination: {
          screen: Pagination,
          navigationOptions: ({ navigation }) => ({
            headerTitle: <HeaderTitleWithI18n i18nKey="title" style="subTitle" />,
            headerLeft: (
              <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
            )
          })
        }
      }),
      navigationOptions: {
        drawerLabel: <HeaderTitleWithI18n i18nKey="title" />
      }
    }
  },
  localization: { ns: 'pagination', resources }
});
