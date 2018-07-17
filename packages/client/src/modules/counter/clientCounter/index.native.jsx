import React from 'react';
import { createStackNavigator } from 'react-navigation';

import translate from '../../../i18n';
import { HeaderTitle } from '../../common/components/native';
import ClientCounter from './containers/ClientCounter';
import resolvers from './resolvers';
import resources from './locales';
import Feature from '../../connector';

const HeaderTitleWithI18n = translate('counter')(HeaderTitle);

export default new Feature({
  drawerItem: {
    Counter: {
      screen: createStackNavigator({
        Counter: {
          screen: ClientCounter
        }
      }),
      navigationOptions: {
        drawerLabel: <HeaderTitleWithI18n i18nKey="title" />
      }
    }
  },
  resolver: resolvers,
  localization: { ns: 'clientCounter', resources }
});

export { ClientCounter };
