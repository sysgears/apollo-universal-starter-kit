import { foldTo } from 'fractal-objects';
import { VueConstructor } from 'vue';

import ClientModule, { ClientModuleShape } from '@gqlapp/module-client-vue';

export interface CounterModuleShape extends ClientModuleShape {
  counterComponent?: VueConstructor<any>[];
}

class CounterModule extends ClientModule {
  constructor(...modules: CounterModuleShape[]) {
    super(...modules);
    foldTo(this, modules);
  }
}

export default CounterModule;
