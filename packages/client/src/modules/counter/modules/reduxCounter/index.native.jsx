import React from 'react';
import { createStackNavigator } from 'react-navigation';

import translate from '../../../../i18n/index';
import { HeaderTitle } from '../../../common/components/native/index';
import ReduxCounter from './containers/ReduxCounter';
import reducers from './reducers/index';
import resources from './locales/index';
import Feature from '../../../connector';

const HeaderTitleWithI18n = translate('counter')(HeaderTitle);

export default new Feature({
  drawerItem: {
    Counter: {
      screen: createStackNavigator({
        Counter: {
          screen: ReduxCounter
        }
      }),
      navigationOptions: {
        drawerLabel: <HeaderTitleWithI18n i18nKey="title" />
      }
    }
  },
  reducer: { counter: reducers },
  localization: { ns: 'counter', resources }
});
