import ClientModule, { ClientModuleShape } from '@gqlapp/module-client-angular';

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
