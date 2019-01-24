import ServerModule, { ServerModuleShape } from '@module/module-server-ts';

interface ReportModuleShape extends ServerModuleShape {}

interface ReportModule extends ReportModuleShape {}
class ReportModule extends ServerModule {
  constructor(...modules: ReportModuleShape[]) {
    super(...modules);
  }
}

export default ReportModule;
