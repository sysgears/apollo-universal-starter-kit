import { ApolloClient } from 'apollo-client';

import ClientModule, { ClientModuleShape } from '../../ClientModule';

export interface AccessModuleShape extends ClientModuleShape {
  login?: Array<(client: ApolloClient<any>) => Promise<void>>;
  logout?: Array<(client: ApolloClient<any>) => Promise<void>>;
}

interface AccessModule extends AccessModuleShape {}

class AccessModule extends ClientModule {
  constructor(...modules: AccessModuleShape[]) {
    super(...modules);
  }

  public async doLogin(client: ApolloClient<any>) {
    for (const login of this.login) {
      await login(client);
    }
  }

  public async doLogout(client: ApolloClient<any>) {
    for (const logout of this.logout) {
      await logout(client);
    }
  }
}

export default AccessModule;
