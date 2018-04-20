import React from 'react';
import { createApolloFetch } from 'apollo-fetch';
import { constructUploadOptions } from 'apollo-fetch-upload';
import { StackNavigator } from 'react-navigation';

import translate from '../../i18n';
import { HeaderTitle, MenuButton } from '../common/components/native';
import Upload from './containers/Upload';
import reducers from './reducers';
import resources from './locales';

import Feature from '../connector';

const HeaderTitleWithI18n = translate('upload')(HeaderTitle);

export default new Feature({
  catalogInfo: { upload: true },
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
  createFetch: uri =>
    createApolloFetch({
      uri,
      constructOptions: (reqs, options) => ({
        ...constructUploadOptions(reqs, options),
        credentials: 'include'
      })
    })
});
