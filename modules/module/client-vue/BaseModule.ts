import { foldTo } from 'fractal-objects';
import { merge } from 'lodash';

import CommonModule, { GraphQLModuleShape } from '@gqlapp/module-common';

export interface BaseModuleShape extends GraphQLModuleShape {
  // TODO: Add proper type
  reducer?: { [key: string]: any }[];
}

abstract class BaseModule extends CommonModule implements BaseModuleShape {
  // TODO: Add proper type
  reducer?: { [key: string]: any }[];

  constructor(...modules: BaseModuleShape[]) {
    super(...modules);
    foldTo(this, modules);
  }

  get reducers() {
    return merge({}, ...(this.reducer || []));
  }
}

export default BaseModule;
