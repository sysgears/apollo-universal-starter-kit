import BaseModule, { BaseModuleShape } from '../../BaseModule';

export interface AccessModuleShape extends BaseModuleShape {
  login?: Array<(client: any) => void>;
  logout?: Array<(client: any) => void>;
}

interface AccessModule extends AccessModuleShape {}

class AccessModule extends BaseModule {
  constructor(...modules: AccessModuleShape[]) {
    super(...modules);
  }

  public async doLogin(client: any) {
    for (const login of this.login) {
      await login(client);
    }
  }

  public async doLogout(client: any) {
    for (const logout of this.logout) {
      await logout(client);
    }
  }
}

export default AccessModule;
