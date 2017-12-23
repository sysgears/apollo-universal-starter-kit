import { TabNavigator } from 'react-navigation';

import plugins from '../plugins';

const MainScreenNavigator = TabNavigator({
  ...plugins.tabItems
});

export default MainScreenNavigator;
