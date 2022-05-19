import { foldTo } from 'fractal-objects';
import { RouteConfig } from 'vue-router';

import BaseModule, { BaseModuleShape } from './BaseModule';

export interface ClientModuleShape extends BaseModuleShape {
  route?: RouteConfig[];
}

class ClientModule extends BaseModule implements ClientModuleShape {
  route?: RouteConfig[];

  constructor(...modules: ClientModuleShape[]) {
    super(...modules);
    foldTo(this, modules);
  }

  get routes(): RouteConfig[] {
    return this.route || [];
  }
}

export default ClientModule;
