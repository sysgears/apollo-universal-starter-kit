import { foldTo } from 'fractal-objects';
import ServerModule, { ServerModuleShape } from '@gqlapp/module-server-ts';

class AuthModule extends ServerModule implements ServerModuleShape {
  constructor(...modules: ServerModuleShape[]) {
    super(...modules);
    foldTo(this, modules);
  }
}

export default AuthModule;
