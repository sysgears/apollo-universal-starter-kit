import BaseModule, { BaseModuleShape } from './BaseModule';

import { merge } from 'lodash';

export interface ClientModuleShape extends BaseModuleShape {
  drawerItem?: any[];
}

export default class ClientModule extends BaseModule implements ClientModuleShape {
  public drawerItem?: any[];

  constructor(...modules: ClientModuleShape[]) {
    super(...modules);
  }

  get drawerItems() {
    return merge({}, ...this.drawerItem);
  }
}
