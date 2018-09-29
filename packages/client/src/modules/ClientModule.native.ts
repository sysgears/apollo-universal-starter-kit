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

type Constructor = new (...args: any[]) => ClientModule;

export const addClientModuleMethods = (Base: Constructor) => {
  return class extends Base {
    public drawerItem?: any[];

    get drawerItems() {
      return merge({}, ...this.drawerItem);
    }

    public getSkippedDrawerItems() {
      const items = this.drawerItems;
      return Object.keys(items).filter(itemName => {
        return items[itemName].skip;
      });
    }
  };
};

export default addBaseModuleMethods(addClientModuleMethods(ClientModule));
