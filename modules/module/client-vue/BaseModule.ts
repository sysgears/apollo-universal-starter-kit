import { merge } from 'lodash';

import { GraphQLModule, GraphQLModuleShape } from '@gqlapp/module-common';

export interface BaseModuleShape extends GraphQLModuleShape {
  // TODO: Add proper type
  reducer?: Array<{ [key: string]: any }>;
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
