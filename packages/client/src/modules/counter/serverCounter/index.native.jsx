import React from 'react';
import { createStackNavigator } from 'react-navigation';

import translate from '../../../i18n';
import { HeaderTitle } from '../../common/components/native';
import ServerCounter from './containers/ServerCounter';
import resources from './locales';
import Feature from '../../connector';

const HeaderTitleWithI18n = translate('counter')(HeaderTitle);

export default new Feature({
  drawerItem: {
    Counter: {
      screen: createStackNavigator({
        Counter: {
          screen: ServerCounter
        }
      }),
      navigationOptions: {
        drawerLabel: <HeaderTitleWithI18n i18nKey="title" />
      }
    }
  },
  localization: { ns: 'serverCounter', resources }
});

export { ServerCounter };
