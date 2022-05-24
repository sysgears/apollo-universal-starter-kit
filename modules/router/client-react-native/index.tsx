import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import ClientModule from '@gqlapp/module-client-react-native';

const Drawer = createDrawerNavigator();

const ref: { modules: ClientModule } = { modules: null };

const Router = () => (
  <NavigationContainer>
    <Drawer.Navigator>{ref.modules.createDrawerItems(Drawer).map((x) => x.screen)}</Drawer.Navigator>
  </NavigationContainer>
);

export default new ClientModule({
  router: <Router />,
  onAppCreate: [async (modules: ClientModule) => (ref.modules = modules)],
});
