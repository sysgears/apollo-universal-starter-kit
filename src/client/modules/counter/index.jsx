import { Ionicons } from '@expo/vector-icons';

import { createTabBarIconWrapper } from '../common/components/native';
import Counter from './containers/Counter';
import reducers from './reducers';
import resolvers from './resolvers';

import Feature from '../connector';

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
  resolver: resolvers,
  reducer: { counter: reducers }
});
