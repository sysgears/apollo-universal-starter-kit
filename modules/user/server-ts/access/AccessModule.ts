import { merge } from 'lodash';
import ServerModule, { ServerModuleShape } from '@module/module-server-ts';

// TODO: Change type of user variable from any to User type, after converting the User DAO into Typescript
interface AccessModuleShape extends ServerModuleShape {
  grant: Array<(user: any, req: Request) => { [key: string]: any } | void>;
}

interface AccessModule extends AccessModuleShape {}

class AccessModule extends ServerModule {
  constructor(...modules: AccessModuleShape[]) {
    super(...modules);
  }

  get grantAccess() {
    return async (user: any, req: Request) => {
      let result = {};
      for (const grant of this.grant) {
        result = merge(result, await grant(user, req));
      }
      return result;
    };
  }
}

export default AccessModule;
