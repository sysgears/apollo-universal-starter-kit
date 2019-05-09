import { NavigationRouteConfig } from 'react-navigation';

import BaseModule, { BaseModuleShape } from '@gqlapp/module-client-react';

import { merge } from 'lodash';

/**
 * React Native feature modules interface.
 */
export interface ClientModuleShape extends BaseModuleShape {
  // Item list for React Navigation drawer
  drawerItem?: NavigationRouteConfig[];
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
   * @returns item list for React Navigation drawer
   */
  get drawerItems() {
    return merge({}, ...this.drawerItem);
  }
}

export default ClientModule;
