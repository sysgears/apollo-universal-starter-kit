import { foldTo } from 'fractal-objects';

export interface ModuleShape {
  onAppCreate?: Array<(modules: Module) => void>;
}
interface Module extends ModuleShape {}
class Module {
  constructor(...modules: ModuleShape[]) {
    foldTo(this, modules);
  }

  public triggerOnAppCreate() {
    if (this.onAppCreate) {
      this.onAppCreate.forEach(callback => callback(this));
    }
  }
}

export default Module;
