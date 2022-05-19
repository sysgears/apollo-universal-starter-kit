import { foldTo } from 'fractal-objects';
import { merge } from 'lodash';
import ServerModule, { ServerModuleShape } from '@gqlapp/module-server-ts';

// TODO: Change type of identity variable from any to User type, after converting the User DAO into Typescript
interface AccessModuleShape extends ServerModuleShape {
  grant: ((identity: any, req: Request, passwordHash: string) => { [key: string]: any } | void)[];
}

class AccessModule extends ServerModule implements AccessModuleShape {
  grant: ((identity: any, req: Request, passwordHash: string) => { [key: string]: any } | void)[];

  constructor(...modules: AccessModuleShape[]) {
    super(...modules);
    foldTo(this, modules);
  }

  get grantAccess() {
    return async (identity: any, req: Request, passwordHash: string) => {
      let result = {};
      for (const grant of this.grant) {
        result = merge(result, await grant(identity, req, passwordHash));
      }
      return result;
    };
  }
}

export default AccessModule;
