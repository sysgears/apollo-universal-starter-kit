import { DrawerNavigator } from 'react-navigation';

import modules from '..';
import { DrawerComponent } from '../common/components/native';
import Feature from '../connector';

const routerFactory = () =>
  DrawerNavigator(
    {
      ...modules.tabItems
    },
    {
      contentComponent: DrawerComponent
    }
  );

export default new Feature({
  routerFactory
});
