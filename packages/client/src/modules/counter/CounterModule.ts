import ClientModule, { ClientModuleShape } from '../ClientModule';

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
