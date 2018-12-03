import React from 'react';
import { createDrawerNavigator } from 'react-navigation';

import { DrawerComponent } from '../common/components/native';
import ClientModule from '../ClientModule';

const ref = { modules: null };

const routerFactory = () => {
  return createDrawerNavigator(
    {
      ...ref.modules.drawerItems
    },
    {
      // eslint-disable-next-line
      contentComponent: props => <DrawerComponent {...props} drawerItems={ref.modules.drawerItems} />
    }
  );
};

export default new ClientModule({
  routerFactory,
  onCreate: [modules => (ref.modules = modules)]
});
