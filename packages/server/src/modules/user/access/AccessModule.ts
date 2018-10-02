import { merge } from 'lodash';

import ServerModule, { ServerModuleShape } from '../../ServerModule';

interface AccessModuleShape extends ServerModuleShape {
  grant: any[];
}

export default class AccessModule extends ServerModule implements AccessModuleShape {
  public grant: any[];

  constructor(...modules: AccessModuleShape[]) {
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
