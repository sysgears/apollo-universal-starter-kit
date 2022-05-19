import { foldTo } from 'fractal-objects';
import ClientModule, { ClientModuleShape } from '@gqlapp/module-client-angular';

export interface CounterModuleShape extends ClientModuleShape {
  counterModule?: any[];
}

class CounterModule extends ClientModule {
  constructor(...modules: CounterModuleShape[]) {
    super(...modules);
    foldTo(this, modules);
  }
}

export default CounterModule;
