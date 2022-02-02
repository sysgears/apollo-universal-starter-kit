import React from 'react';

import BaseModule, { BaseModuleShape } from '@gqlapp/module-client-react';
import { createDrawerNavigator } from '@react-navigation/drawer';

/**
 * React Native feature modules interface.
 */
export interface ClientModuleShape extends BaseModuleShape {
  // Screen list for React Navigation Drawer
  drawerItem?: Array<(Drawer: ReturnType<typeof createDrawerNavigator>) => React.ReactElement<any>>;
}

interface ClientModule extends ClientModuleShape {}

/**
 * React Native feature module implementation.
 */
class ClientModule extends BaseModule {
  /**
   * Constructs React Native client feature module representation, that folds all the feature modules
   * into a single module represented by this instance.
   *
   * @param modules feature modules
   */
  constructor(...modules: ClientModuleShape[]) {
    super(...modules);
  }

  /**
   * @returns screen list for React Navigation Drawer
   */
  public createDrawerItems(Drawer: ReturnType<typeof createDrawerNavigator>) {
    return (this.drawerItem || [])
      .map(x => x(Drawer))
      .map((component: React.ReactElement<any>, idx: number, items: Array<React.ReactElement<any>>) =>
        React.cloneElement(component, { key: component.key || idx + items.length })
      );
  }
}

export default ClientModule;
