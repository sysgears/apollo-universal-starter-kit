import React from 'react';
import { createStackNavigator } from 'react-navigation';

import translate from '../../i18n';
import { HeaderTitle, IconButton } from '../common/components/native';
import PaginationDemo from './containers/PaginationDemo.native';
import resources from './locales';

import Feature from '../connector';

const HeaderTitleWithI18n = translate('pagination')(HeaderTitle);

export default new Feature({
  drawerItem: {
    Pagination: {
      screen: createStackNavigator({
        Pagination: {
          screen: PaginationDemo,
          navigationOptions: ({ navigation }) => ({
            headerTitle: <HeaderTitleWithI18n style="subTitle" />,
            headerLeft: (
              <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
            )
          })
        }
      }),
      navigationOptions: {
        drawerLabel: <HeaderTitleWithI18n />
      }
    }
  },
  localization: { ns: 'pagination', resources }
});
