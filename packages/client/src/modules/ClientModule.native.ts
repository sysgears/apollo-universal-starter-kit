import BaseModule from './BaseModule';

import { merge } from 'lodash';

class ClientModule extends BaseModule {
  public drawerItem?: any[];

  constructor(...modules: Array<typeof ClientModule>) {
    super(...modules);
  }

  get drawerItems() {
    return merge({}, ...this.drawerItem);
  }
}

export default ClientModule;
