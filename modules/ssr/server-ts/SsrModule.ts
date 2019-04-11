import ServerModule, { ServerModuleShape } from '@gqlapp/module-server-ts';

interface SsrModule extends ServerModuleShape {}

class SsrModule extends ServerModule {
  constructor(...modules: ServerModuleShape[]) {
    super(...modules);
  }
}

export default SsrModule;
