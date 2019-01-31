import React from 'react';
import { merge } from 'lodash';
import { Reducer } from 'redux';

import { GraphQLModule, GraphQLModuleShape } from '@gqlapp/module-common';

export interface BaseModuleShape extends GraphQLModuleShape {
  reducer?: Array<{ [key: string]: Reducer }>;
  router?: React.ReactElement<any>;
  rootComponentFactory?: Array<(req: Request) => React.ReactElement<any>>;
  dataRootComponent?: React.ComponentType[];
}

interface BaseModule extends BaseModuleShape {}

class BaseModule extends GraphQLModule {
  constructor(...modules: BaseModuleShape[]) {
    super(...modules);
  }

  get reducers() {
    return merge({}, ...this.reducer);
  }

  public getDataRoot(root: React.ReactElement<any>) {
    let nestedRoot = root;
    for (const component of this.dataRootComponent || []) {
      nestedRoot = React.createElement(component, {}, nestedRoot);
    }
    return nestedRoot;
  }

  public getWrappedRoot(root: React.ReactElement<any>, req?: Request) {
    let nestedRoot = root;
    for (const componentFactory of this.rootComponentFactory || []) {
      nestedRoot = React.cloneElement(componentFactory(req), {}, nestedRoot);
    }
    return nestedRoot;
  }
}

export default BaseModule;
