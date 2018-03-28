import Ionicons from '@expo/vector-icons/Ionicons';

import { createTabBarIconWrapper } from '../common/components/native';
import Counter from './containers/Counter.native';
import reducers from './reducers';
import clientStateParams from './resolvers';

import Feature from '../connector.native';

export default new Feature({
  tabItem: {
    Counter: {
      screen: Counter,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-home-outline',
          size: 30
        })
      }
    }
  },
  clientStateParams,
  reducer: { counter: reducers }
});
