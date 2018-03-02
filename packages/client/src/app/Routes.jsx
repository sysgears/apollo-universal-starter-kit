import { TabNavigator } from 'react-navigation';

import modules from '../modules';

const MainScreenNavigator = TabNavigator(
  {
    ...modules.tabItems
  },
  {
    navigationOptions: {
      swipeEnabled: false
    }
  }
);

export default MainScreenNavigator;
