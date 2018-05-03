import React from 'react';
import { StackNavigator } from 'react-navigation';

import createNetLink from './netLink';
import translate from '../../i18n';
import { HeaderTitle, MenuButton } from '../common/components/native';
import Upload from './containers/Upload';
import reducers from './reducers';
import resources from './locales';

import Feature from '../connector';

const HeaderTitleWithI18n = translate('upload')(HeaderTitle);

export default new Feature({
  data: { upload: true },
  drawerItem: {
    Upload: {
      screen: StackNavigator({
        Upload: {
          screen: Upload,
          navigationOptions: ({ navigation }) => ({
            headerTitle: <HeaderTitleWithI18n i18nKey="title" style="subTitle" />,
            headerLeft: <MenuButton navigation={navigation} />
          })
        }
      }),
      navigationOptions: {
        drawerLabel: <HeaderTitleWithI18n />
      }
    }
  },
  reducer: { upload: reducers },
  localization: { ns: 'upload', resources },
  createNetLink
});
