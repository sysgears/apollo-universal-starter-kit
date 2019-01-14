import { merge } from 'lodash';
import CommonModule from '@module/module-common';

console.log('============= Client-vue');

class BaseModule extends CommonModule {
  constructor(...modules) {
    super(...modules);
  }

  get reducers() {
    return merge({}, ...this.reducer);
  }

  get resolvers() {
    return merge({}, ...this.resolver);
  }

  get connectionParams() {
    return this.connectionParam;
  }
}

class ClientModule extends BaseModule {
  constructor(...modules) {
    super(...modules);
  }

  get modules() {
    return this.module.map(module => module);
  }

  // get routes(): Routes {
  //   return this.route.map((component: Route) => component);
  // }
}

const createApp = modules => {
  console.log('============= modules : ', modules);
};

const core = new ClientModule({
  onAppCreate: [createApp]
});

const modules = new ClientModule(core);

export default modules;
