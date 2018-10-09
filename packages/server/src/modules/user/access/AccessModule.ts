import { merge } from 'lodash';

import ServerModule, { ServerModuleShape } from '../../ServerModule';

interface AccessModuleShape extends ServerModuleShape {
  grant: any[];
}

interface AccessModule extends AccessModuleShape {}
class AccessModule extends ServerModule {
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

export default AccessModule;
