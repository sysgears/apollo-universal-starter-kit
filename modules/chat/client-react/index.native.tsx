import React from 'react';

import ClientModule from '@gqlapp/module-client-react-native';
import { translate } from '@gqlapp/i18n-client-react';
import { HeaderTitle, IconButton } from '@gqlapp/look-client-react-native';

import Chat from './containers/ChatOperations';
import resources from './locales';

const HeaderTitleWithI18n = translate('chat')(HeaderTitle);

export default new ClientModule({
  drawerItem: [
    {
      screen: (Drawer) => (
        <Drawer.Screen
          name="Chat"
          component={Chat}
          options={({ navigation }) => ({
            headerTitle: () => <HeaderTitleWithI18n style="subTitle" />,
            headerLeft: () => (
              <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
            ),
            drawerLabel: () => <HeaderTitleWithI18n />,
          })}
        />
      ),
    },
  ],
  localization: [{ ns: 'chat', resources }],
});
