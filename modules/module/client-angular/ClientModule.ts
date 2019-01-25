import BaseModule, { BaseModuleShape } from './BaseModule';
import { Route, Routes } from '@angular/router';

export interface ClientModuleShape extends BaseModuleShape {
  module?: any;
  route?: Routes;
  navItem?: NavigationItem[];
  navItemRight?: NavigationItem[];
}

export interface NavigationItem {
  name: string;
  link: string;
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

  get navItems(): NavigationItem[] {
    return this.navItem && this.navItem.map((item: NavigationItem) => item);
  }

  get navItemsRight(): NavigationItem[] {
    return this.navItemRight && this.navItemRight.map((item: NavigationItem) => item);
  }
}

export default ClientModule;
