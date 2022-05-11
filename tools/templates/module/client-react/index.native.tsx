import React from 'react';

import { translate } from '@gqlapp/i18n-client-react';
import ClientModule from '@gqlapp/module-client-react-native';
import { HeaderTitle, IconButton } from '@gqlapp/look-client-react-native';

import $Module$ from './containers/$Module$';
import resources from './locales';

const HeaderTitleWithI18n = translate('$module$')(HeaderTitle);

export default new ClientModule({
  drawerItem: [
    {
      screen: Drawer => (
        <Drawer.Screen name="$Module$" component={$Module$} options={({navigation}) => ({
          headerTitle: () => <HeaderTitleWithI18n style="subTitle" />,
          headerLeft: () => (
            <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
          ),
          headerStyle: { backgroundColor: '#fff' },
          drawerLabel: () => <HeaderTitleWithI18n />
        })}
        />
      )
    }
  ],
  localization: [{ ns: '$module$', resources }]
});
