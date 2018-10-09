import React from 'react';
import BaseModule, { BaseModuleShape } from './BaseModule';

export interface ClientModuleShape extends BaseModuleShape {
  route?: any[];
  navItem?: any[];
  navItemRight?: any[];
  stylesInsert?: any[];
  scriptsInsert?: any[];
}

interface ClientModule extends ClientModuleShape {}
class ClientModule extends BaseModule {
  constructor(...modules: ClientModuleShape[]) {
    super(...modules);
  }

  get routes() {
    return this.route.map((component: any, idx: number, items: any) =>
      React.cloneElement(component, { key: component.key || idx + items.length })
    );
  }

  get navItems() {
    return this.navItem.map((component: any, idx: number, items: any) =>
      React.cloneElement(component, {
        key: component.key || idx + items.length
      })
    );
  }

  get navItemsRight() {
    return this.navItemRight.map((component: any, idx: number, items: any) =>
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
