import ServerModule, { ServerModuleShape } from '@gqlapp/module-server-ts';
import { Express } from 'express';

interface SsrModuleShape extends ServerModuleShape {
  ssr: (app: Express, { schema, modules }: any) => void;
}

interface SsrModule extends SsrModuleShape {}

class SsrModule extends ServerModule {
  constructor(...modules: SsrModuleShape[]) {
    super(...modules);
  }
}

export default SsrModule;
