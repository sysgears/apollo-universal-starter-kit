import { TabNavigator } from 'react-navigation';

import modules from '../index.native';

import Feature from '../connector.native';

const routerFactory = () =>
  TabNavigator({
    ...modules.tabItems
  });

export default new Feature({
  routerFactory
});
