import React from 'react';
import { createStackNavigator } from 'react-navigation';

import translate from '../../../i18n';
import { HeaderTitle } from '../../common/components/native';
import ReduxCounter from './containers/ReduxCounter';
import reducers from './reducers';
import resources from './locales';
import Feature from '../../connector';

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
  localization: { ns: 'reduxCounter', resources }
});

export { ReduxCounter };
