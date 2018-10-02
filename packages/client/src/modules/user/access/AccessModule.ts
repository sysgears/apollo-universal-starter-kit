import BaseModule from '../../BaseModule';

class AccessModule extends BaseModule {
  public login: Array<(client: any) => void>;
  public logout: Array<(client: any) => void>;

  constructor(...modules: Array<typeof AccessModule>) {
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
