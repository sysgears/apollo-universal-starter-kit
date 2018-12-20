import { ApolloClient } from 'apollo-client';

import ClientModule, { ClientModuleShape } from '@module/module-client-react';

export interface AccessModuleShape extends ClientModuleShape {
  login?: Array<(client: ApolloClient<any>) => Promise<void>>;
  logout?: Array<(client: ApolloClient<any>) => Promise<void>>;
  logoutFromAllDevices?: Array<(client: ApolloClient<any>) => Promise<void>>;
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

  public async doLogoutFromAllDevices(client: ApolloClient<any>) {
    for (const logoutFromAllDevices of this.logoutFromAllDevices) {
      await logoutFromAllDevices(client);
    }
  }
}

export default AccessModule;
