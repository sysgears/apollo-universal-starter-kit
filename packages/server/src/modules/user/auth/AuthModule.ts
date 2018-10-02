import ServerModule from '../../ServerModule';

class AuthModule extends ServerModule {
  constructor(...modules: Array<typeof AuthModule>) {
    super(...modules);
  }
}

export default AuthModule;
