import ServerModule, { ServerModuleShape } from '../../ServerModule';

// tslint:disable-next-line
interface AuthModuleShape extends ServerModuleShape {}

class AuthModule extends ServerModule implements AuthModuleShape {
  constructor(...modules: AuthModuleShape[]) {
    super(...modules);
  }
}

export default AuthModule;
