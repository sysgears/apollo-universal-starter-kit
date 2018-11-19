import React from 'react';
import ClientModule, { ClientModuleShape } from '@module/module-client-react';

export interface CounterModuleShape extends ClientModuleShape {
  counterModule?: any[];
}

interface CounterModule extends CounterModuleShape {}

class CounterModule extends ClientModule {
  constructor(...modules: CounterModuleShape[]) {
    super(...modules);
  }
}

export default CounterModule;
