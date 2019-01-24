import BaseModule, { BaseModuleShape } from './BaseModule';
import { Route, Routes } from '@angular/router';

export interface ClientModuleShape extends BaseModuleShape {
  module?: any;
  route?: Routes;
  navItem?: any[];
  navItemRight?: any[];
}

interface ClientModule extends ClientModuleShape {}

class ClientModule extends BaseModule {
  constructor(...modules: ClientModuleShape[]) {
    super(...modules);
  }

  get modules(): any {
    return this.module.map((module: any) => module);
  }

  get routes(): Routes {
    return this.route.map((component: Route) => component);
  }

  get navItems(): any[] {
    return this.route.map((component: any) => component);
  }

  get navItemsRight(): any[] {
    return this.route.map((component: any) => component);
  }
}

export default ClientModule;
