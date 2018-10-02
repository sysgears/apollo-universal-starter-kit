import { merge } from 'lodash';

import ServerModule from '../../ServerModule';

export default class AccessModule extends ServerModule {
  public grant: any[];

  constructor(...modules: Array<typeof AccessModule>) {
    super(...modules);
  }

  get grantAccess() {
    return async (user: any, req: any) => {
      let result = {};
      for (const grant of this.grant) {
        result = merge(result, await grant(user, req));
      }
      return result;
    };
  }
}
