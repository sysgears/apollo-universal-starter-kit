import BaseModule, { BaseModuleShape } from './BaseModule';

export interface ClientModuleShape extends BaseModuleShape {
  module?: any;
  route?: [];
}

interface ClientModule extends ClientModuleShape {}

class ClientModule extends BaseModule {
  constructor(...modules: ClientModuleShape[]) {
    super(...modules);
  }

  get modules(): any {
    return this.module.map((module: any) => module);
  }

  get routes(): any {
    return this.route.map((component: any) => component);
  }
}

export default ClientModule;
