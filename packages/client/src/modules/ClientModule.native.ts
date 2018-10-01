import { BaseModule, addBaseModuleMethods } from './BaseModule';

import { unfoldTo } from 'fractal-objects';
import { merge } from 'lodash';

class ClientModule extends BaseModule {
  public drawerItem?: any[];

  constructor(...modules: ClientModule[]) {
    super();
    unfoldTo(this, modules);
  }
}

export const addClientModuleMethods = (Base: { new (...args: any[]): ClientModule }) => {
  return class extends Base {
    public drawerItem?: any[];

    get drawerItems() {
      return merge({}, ...this.drawerItem);
    }
  };
};

export default addBaseModuleMethods(addClientModuleMethods(ClientModule));
