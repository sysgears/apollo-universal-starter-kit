import { unfoldTo } from 'fractal-objects';

class AccessModule {
  public link: any[];
  public dataRootComponent: any[];
  public login: any[];
  public logout: any[];

  constructor(...modules: AccessModule[]) {
    unfoldTo(this, modules);
  }
}

export default class extends AccessModule {
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
