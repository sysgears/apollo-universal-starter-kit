import { foldTo } from 'fractal-objects';

export interface ModuleShape {
  onCreate?: Array<(modules: Module) => void>;
}
interface Module extends ModuleShape {}
class Module {
  constructor(...modules: ModuleShape[]) {
    foldTo(this, modules);
  }

  public triggerOnCreate() {
    if (this.onCreate) {
      this.onCreate.forEach(callback => callback(this));
    }
  }
}

export default Module;
