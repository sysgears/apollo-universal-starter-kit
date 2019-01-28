import ServerModule, { ServerModuleShape } from '@gqlapp/module-server-ts';

interface SsrModuleShape extends ServerModuleShape {
  ssr: () => void;
}

interface SsrModule extends SsrModuleShape {}

class SsrModule extends ServerModule {
  constructor(...modules: ServerModuleShape[]) {
    super(...modules);
  }
}

export default SsrModule;
