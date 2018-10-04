import ServerModule, { ServerModuleShape } from '../../ServerModule';

interface AuthModuleShape extends ServerModuleShape {}

interface AuthModule extends AuthModuleShape {}
class AuthModule extends ServerModule {
  constructor(...modules: AuthModuleShape[]) {
    super(...modules);
  }
}

export default AuthModule;
