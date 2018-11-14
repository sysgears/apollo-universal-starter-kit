import { Resource } from 'i18next';

import Module from './Module';

export interface CommonModuleShape {
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
