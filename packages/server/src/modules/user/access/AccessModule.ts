import { unfoldTo } from 'fractal-objects';
import { merge } from 'lodash';

class AccessModule {
  public grant: any[];
  // GraphQL API
  public schema?: any[];
  public createResolversFunc?: any[];
  public createContextFunc?: any[];
  // Middleware
  public beforeware?: any[];
  public middleware?: any[];

  public htmlHeadComponent?: any[];

  // eslint-disable-next-line
  constructor(...modules: AccessModule[]) {
    unfoldTo(this, modules);
  }
}

export default class extends AccessModule {
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
