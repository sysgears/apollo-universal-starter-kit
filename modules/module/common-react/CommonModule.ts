import { Resource } from 'i18next';

import Module, { ModuleShape } from './Module';

export interface CommonModuleShape extends ModuleShape {
  localization?: Array<{ ns: string; resources: Resource }>;
}

interface CommonModule extends CommonModuleShape {}
class CommonModule extends Module {
  constructor(...modules: CommonModuleShape[]) {
    super(...modules);
  }

  get localizations() {
    return this.localization;
  }
}

export default CommonModule;
