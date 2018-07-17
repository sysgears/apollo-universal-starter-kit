import React from 'react';
import { createStackNavigator } from 'react-navigation';

import translate from '../../../i18n';
import { HeaderTitle } from '../../common/components/native';
import ServerCounterContainer from './containers/ServerCounter';
import resources from './locales';
import Feature from '../../connector';
import { ServerCounterView, ServerCounterButton } from './components/ServerCounterView';
import ADD_COUNTER from './graphql/AddCounter.graphql';
import COUNTER_SUBSCRIPTION from './graphql/CounterSubscription.graphql';
import COUNTER_QUERY from './graphql/CounterQuery.graphql';

const HeaderTitleWithI18n = translate('counter')(HeaderTitle);

export default new Feature({
  drawerItem: {
    Counter: {
      screen: createStackNavigator({
        Counter: {
          screen: ServerCounterContainer
        }
      }),
      navigationOptions: {
        drawerLabel: <HeaderTitleWithI18n i18nKey="title" />
      }
    }
  },
  localization: { ns: 'serverCounter', resources }
});

export {
  ServerCounterView,
  ServerCounterButton,
  ServerCounterContainer,
  ADD_COUNTER,
  COUNTER_SUBSCRIPTION,
  COUNTER_QUERY
};
