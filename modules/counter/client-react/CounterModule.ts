import { foldTo } from 'fractal-objects';
import React from 'react';
import ClientModule, { ClientModuleShape } from '@gqlapp/module-client-react';

export interface CounterModuleShape extends ClientModuleShape {
  counterComponent?: React.ReactElement<any>[];
}

class CounterModule extends ClientModule implements CounterModuleShape {
  counterComponent?: React.ReactElement<any>[];

  constructor(...modules: CounterModuleShape[]) {
    super(...modules);
    foldTo(this, modules);
  }
}

export default CounterModule;
