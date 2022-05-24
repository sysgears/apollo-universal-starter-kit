import { foldTo } from 'fractal-objects';
import React from 'react';
import ClientModule, { ClientModuleShape } from '@gqlapp/module-client-react';

export interface ReportModuleShape extends ClientModuleShape {
  reportComponent?: React.ReactElement<any>[];
}

class ReportModule extends ClientModule implements ReportModuleShape {
  reportComponent?: React.ReactElement<any>[];

  constructor(...modules: ReportModuleShape[]) {
    super(...modules);
    foldTo(this, modules);
  }
}

export default ReportModule;
