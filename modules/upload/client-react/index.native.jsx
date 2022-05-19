import React from 'react';
import ClientModule from '@gqlapp/module-client-react-native';
import { translate } from '@gqlapp/i18n-client-react';
import { HeaderTitle, IconButton } from '@gqlapp/look-client-react-native';

import createNetLink from './netLink';
import Upload from './containers/Upload';
import resources from './locales';

const HeaderTitleWithI18n = translate('upload')(HeaderTitle);

export default new ClientModule({
  context: { upload: true },
  drawerItem: [
    {
      screen: (Drawer) => (
        <Drawer.Screen
          name="Upload"
          component={Upload}
          options={({ navigation }) => ({
            headerTitle: () => <HeaderTitleWithI18n i18nKey="title" style="subTitle" />,
            headerLeft: () => (
              <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
            ),
            headerStyle: { backgroundColor: '#fff' },
            drawerLabel: () => <HeaderTitleWithI18n />,
          })}
        />
      ),
    },
  ],
  localization: [{ ns: 'upload', resources }],
  createNetLink,
});
