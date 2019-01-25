import React from 'react';
import ClientModule, { ClientModuleShape } from '@gqlapp/module-client-react';

export interface CounterModuleShape extends ClientModuleShape {
  counterComponent?: Array<React.ReactElement<any>>;
}

interface CounterModule extends CounterModuleShape {}

class CounterModule extends ClientModule {
  constructor(...modules: CounterModuleShape[]) {
    super(...modules);
  }
}

export default CounterModule;
