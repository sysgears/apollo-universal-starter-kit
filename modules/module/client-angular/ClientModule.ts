import { foldTo } from 'fractal-objects';
import { Route, Routes } from '@angular/router';

import BaseModule, { BaseModuleShape } from './BaseModule';

export interface ClientModuleShape extends BaseModuleShape {
  module?: any;
  route?: Routes;
}

class ClientModule extends BaseModule implements ClientModuleShape {
  module?: any;
  route?: Routes;

  constructor(...modules: ClientModuleShape[]) {
    super(...modules);
    foldTo(this, modules);
  }

  get modules(): any {
    return (this.module || []).map((module: any) => module);
  }

  get routes(): Routes {
    return (this.route || []).map((component: Route) => component);
  }
}

export default ClientModule;
