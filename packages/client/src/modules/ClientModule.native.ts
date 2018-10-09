import BaseModule, { BaseModuleShape } from './BaseModule';

import { merge } from 'lodash';

export interface ClientModuleShape extends BaseModuleShape {
  drawerItem?: any[];
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
