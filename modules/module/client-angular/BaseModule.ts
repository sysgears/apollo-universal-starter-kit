import { foldTo } from 'fractal-objects';
import { merge } from 'lodash';
import { ActionReducerMap } from '@ngrx/store';

import CommonModule, { GraphQLModuleShape } from '@gqlapp/module-common';

export interface BaseModuleShape extends GraphQLModuleShape {
  reducer?: ActionReducerMap<any, any>[];
}

class BaseModule extends CommonModule implements BaseModuleShape {
  reducer?: ActionReducerMap<any, any>[];

  constructor(...modules: BaseModuleShape[]) {
    super(...modules);
    foldTo(this, modules);
  }

  get reducers() {
    return merge({}, ...(this.reducer || []));
  }
}

export default BaseModule;
