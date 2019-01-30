import { foldTo } from 'fractal-objects';

export interface ModuleShape {
  onAppCreate?: Array<(modules: Module, entryModule: NodeModule) => void>;
}
interface Module extends ModuleShape {}
class Module {
  constructor(...modules: ModuleShape[]) {
    foldTo(this, modules);
  }

  public createApp(entryModule: NodeModule) {
    if (this.onAppCreate) {
      this.onAppCreate.forEach(callback => callback(this, entryModule));
    }
  }
}

export default Module;
