import React from 'react';
import { createStackNavigator } from 'react-navigation';
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
      Upload: {
        screen: createStackNavigator({
          Upload: {
            screen: Upload,
            navigationOptions: ({ navigation }) => ({
              headerTitle: <HeaderTitleWithI18n i18nKey="title" style="subTitle" />,
              headerLeft: (
                <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
              ),
              headerStyle: { backgroundColor: '#fff' },
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
  localization: [{ ns: 'upload', resources }],
  createNetLink
});
