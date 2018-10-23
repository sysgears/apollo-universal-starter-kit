import React from 'react';
import { createStackNavigator } from 'react-navigation';

import translate from '../../i18n';
import { HeaderTitle, IconButton } from '../common/components/native';
import Chat from './containers/ChatOperations';
import resources from './locales';

import ClientModule from '../ClientModule';

const HeaderTitleWithI18n = translate('chat')(HeaderTitle);

export default new ClientModule({
  drawerItem: [
    {
      Chat: {
        screen: createStackNavigator({
          Chat: {
            screen: Chat,
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
    }
  ],
  localization: [{ ns: 'chat', resources }]
});
