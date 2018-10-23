import { createDrawerNavigator } from 'react-navigation';

import modules from '..';
import { DrawerComponent } from '../common/components/native';
import ClientModule from '../ClientModule';

const routerFactory = () =>
  createDrawerNavigator(
    {
      ...modules.drawerItems
    },
    {
      contentComponent: DrawerComponent
    }
  );

export default new ClientModule({
  routerFactory
});
