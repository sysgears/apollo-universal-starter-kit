import { createDrawerNavigator } from 'react-navigation';

import modules from '..';
import { DrawerComponent } from '../common/components/native';
import Feature from '../connector';

const routerFactory = () =>
  createDrawerNavigator(
    {
      ...modules.drawerItems
    },
    {
      contentComponent: DrawerComponent
    }
  );

export default new Feature({
  routerFactory
});
