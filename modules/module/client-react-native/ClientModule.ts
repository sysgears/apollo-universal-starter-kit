import React from 'react';

import BaseModule, { BaseModuleShape } from '@gqlapp/module-client-react';
import { createDrawerNavigator } from '@react-navigation/drawer';

export interface UserInfo {
  showOnLogin?: boolean;
  skip?: boolean;
  role: string[];
}

export interface InputDrawerItem {
  screen: (Drawer: ReturnType<typeof createDrawerNavigator>) => React.ReactElement<any>;
  userInfo?: UserInfo;
}

export interface DrawerItem {
  screen: React.ReactElement<any>;
  userInfo?: UserInfo;
}

/**
 * React Native feature modules interface.
 */
export interface ClientModuleShape extends BaseModuleShape {
  // Screen list for React Navigation Drawer
  drawerItem?: InputDrawerItem[];
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
  public createDrawerItems(Drawer: ReturnType<typeof createDrawerNavigator>): DrawerItem[] {
    return (this.drawerItem || []).map(({ screen, ...props }, idx, items) => ({
      screen: React.cloneElement(screen(Drawer), { key: idx + items.length }),
      ...props
    }));
  }
}

export default ClientModule;
