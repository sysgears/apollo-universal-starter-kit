import React from 'react';
import { translate } from 'react-i18next';

import { HeaderTitle } from '../common/components/native';
import Counter from './containers/Counter';
import reducers from './reducers';
import resolvers from './resolvers';
import resources from './locales';

import Feature from '../connector';

const HeaderTitleWithI18n = translate('counter')(HeaderTitle);

export default new Feature({
  drawerItem: {
    Counter: {
      screen: Counter,
      navigationOptions: {
        drawerLabel: <HeaderTitleWithI18n i18nKey="title" />
      }
    }
  },
  resolver: resolvers,
  reducer: { counter: reducers },
  localization: { ns: 'counter', resources }
});
