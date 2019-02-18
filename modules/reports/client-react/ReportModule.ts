import React from 'react';
import ClientModule, { ClientModuleShape } from '@gqlapp/module-client-react';

export interface ReportModuleShape extends ClientModuleShape {
  reportComponent?: Array<React.ReactElement<any>>;
}

interface ReportModule extends ReportModuleShape {}

class ReportModule extends ClientModule {
  constructor(...modules: ReportModuleShape[]) {
    super(...modules);
  }
}

export default ReportModule;
