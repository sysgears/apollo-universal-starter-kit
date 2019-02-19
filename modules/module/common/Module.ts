import { foldTo } from 'fractal-objects';
import { merge } from 'lodash';

export interface ModuleShape {
  onAppCreate?: Array<(modules: Module, entryModule: NodeModule) => void>;
  createAppContextFunc?: Array<() => { [key: string]: any }>;
  appContext?: { [key: string]: any };
}
interface Module extends ModuleShape {}
class Module {
  constructor(...modules: ModuleShape[]) {
    foldTo(this, modules);
  }

  public async createAppContext() {
    let appContext = {};
    if (this.createAppContextFunc) {
      for (const createAppContextFunc of this.createAppContextFunc) {
        appContext = merge(appContext, await createAppContextFunc());
      }
    }
    this.appContext = appContext;
  }

  public createApp(entryModule: NodeModule) {
    if (this.onAppCreate) {
      this.onAppCreate.forEach(callback => callback(this, entryModule));
    }
  }
}

export default Module;
