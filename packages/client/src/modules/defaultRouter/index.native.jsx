import { TabNavigator } from 'react-navigation';

import modules from '../';

import Feature from '../connector';

const routerFactory = () =>
  TabNavigator({
    ...modules.tabItems
  });

export default new Feature({
  routerFactory
});
