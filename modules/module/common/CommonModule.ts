import { foldTo } from 'fractal-objects';
import { Resource } from 'i18next';

import Module, { ModuleShape } from './Module';

/**
 * Common ancestor for server and client feature modules interfaces.
 */
export interface CommonModuleShape extends ModuleShape {
  // Localizations for `i18next` library
  localization?: { ns: string; resources: Resource }[];
  // Feature modules shared context
  appContext?: { [key: string]: any };
}

/**
 * Common ancestor for client and server feature modules.
 */
class CommonModule extends Module implements CommonModuleShape {
  // Localizations for `i18next` library
  localization?: { ns: string; resources: Resource }[];
  // Feature modules shared context
  appContext?: { [key: string]: any };

  /**
   * A constructor of common module, that folds all the feature modules
   * into a single module represented by this instance.
   *
   * @param modules feature modules
   */
  constructor(...modules: CommonModuleShape[]) {
    super(...modules);
    foldTo(this, modules);
  }

  /**
   * @returns localization for i18next library
   */
  get localizations() {
    return this.localization || [];
  }
}

export default CommonModule;
