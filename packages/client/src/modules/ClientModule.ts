import React from 'react';
import BaseModule, { BaseModuleShape } from './BaseModule';
import { Route, Routes } from '@angular/router';

export interface ClientModuleShape extends BaseModuleShape {
  route?: Routes;
  navItem?: Array<React.ReactElement<any>>;
  navItemRight?: Array<React.ReactElement<any>>;
  stylesInsert?: string[];
  scriptsInsert?: string[];
}

interface ClientModule extends ClientModuleShape {}

class ClientModule extends BaseModule {
  constructor(...modules: ClientModuleShape[]) {
    super(...modules);
  }

  get routes(): Routes {
    return this.route.map((component: Route) => component);
  }

  get navItems() {
    return this.navItem.map((component: React.ReactElement<any>, idx: number, items: Array<React.ReactElement<any>>) =>
      React.cloneElement(component, {
        key: component.key || idx + items.length
      })
    );
  }

  get navItemsRight() {
    return this.navItemRight.map(
      (component: React.ReactElement<any>, idx: number, items: Array<React.ReactElement<any>>) =>
        React.cloneElement(component, {
          key: component.key || idx + items.length
        })
    );
  }

  get stylesInserts() {
    return this.stylesInsert || [];
  }

  get scriptsInserts() {
    return this.scriptsInsert || [];
  }
}

export default ClientModule;
