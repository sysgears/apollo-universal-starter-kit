import React from 'react';

import resources from './locales';
import { HeaderTitle, IconButton } from '../common/components/native';
import $Module$ from './containers/$Module$';
import ClientModule from '../ClientModule.native';
import translate from '../../i18n';

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
