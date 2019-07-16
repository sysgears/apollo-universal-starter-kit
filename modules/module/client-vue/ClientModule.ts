import { RouteConfig } from 'vue-router';

import BaseModule, { BaseModuleShape } from './BaseModule';

export interface ClientModuleShape extends BaseModuleShape {
  route?: RouteConfig[];
}

interface ClientModule extends ClientModuleShape {}

class ClientModule extends BaseModule {
  constructor(...modules: ClientModuleShape[]) {
    super(...modules);
  }

  get routes(): RouteConfig[] {
    return this.route || [];
  }
}

export default ClientModule;
