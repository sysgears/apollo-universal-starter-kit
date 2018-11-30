import { NavigationRouteConfig } from 'react-navigation';

import BaseModule, { BaseModuleShape } from '@module/module-client-react';

import { merge } from 'lodash';

export interface ClientModuleShape extends BaseModuleShape {
  drawerItem?: NavigationRouteConfig[];
}

interface ClientModule extends ClientModuleShape {}

class ClientModule extends BaseModule {
  constructor(...modules: ClientModuleShape[]) {
    super(...modules);
  }

  get drawerItems() {
    return merge({}, ...this.drawerItem);
  }
}

export default ClientModule;
