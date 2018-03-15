import Ionicons from '@expo/vector-icons/Ionicons';

import { createTabBarIconWrapper } from '../common/components/native';
import Counter from './containers/Counter.native';
import reducers from './reducers';
import resolvers from './resolvers';

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
  resolver: resolvers,
  reducer: { counter: reducers }
});
