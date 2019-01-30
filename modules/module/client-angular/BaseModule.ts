import { merge } from 'lodash';
import { ActionReducerMap } from '@ngrx/store';

import { GraphQLModule, GraphQLModuleShape } from '@gqlapp/module-common';

export interface BaseModuleShape extends GraphQLModuleShape {
  reducer?: Array<ActionReducerMap<any, any>>;
}

interface BaseModule extends BaseModuleShape {}

class BaseModule extends GraphQLModule {
  constructor(...modules: BaseModuleShape[]) {
    super(...modules);
  }

  get reducers() {
    return merge({}, ...this.reducer);
  }
}

export default BaseModule;
