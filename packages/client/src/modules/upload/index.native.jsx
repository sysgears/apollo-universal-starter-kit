import React from 'react';
import { createStackNavigator } from 'react-navigation';

import createNetLink from './netLink';
import translate from '../../i18n';
import { HeaderTitle, IconButton } from '../common/components/native';
import Upload from './containers/Upload';
import resources from './locales';

import ClientModule from '../ClientModule';

const HeaderTitleWithI18n = translate('upload')(HeaderTitle);

export default new ClientModule({
  data: { upload: true },
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
              headerStyle: { backgroundColor: '#fff' }
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
