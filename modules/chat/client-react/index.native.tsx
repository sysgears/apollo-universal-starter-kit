import React from 'react';
import { createStackNavigator, NavigationScreenConfigProps } from 'react-navigation';

import ClientModule from '@gqlapp/module-client-react-native';
import { translate } from '@gqlapp/i18n-client-react';
import { HeaderTitle, IconButton } from '@gqlapp/look-client-react-native';

import Chat from './containers/ChatOperations';
import resources from './locales';

const HeaderTitleWithI18n = translate('chat')(HeaderTitle);

export default new ClientModule({
  drawerItem: [
    {
      Chat: {
        screen: createStackNavigator({
          Chat: {
            screen: Chat,
            navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
              headerTitle: <HeaderTitleWithI18n style="subTitle" />,
              headerLeft: (
                <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
              ),
              headerForceInset: {}
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
