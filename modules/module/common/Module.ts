import { foldTo } from 'fractal-objects';

export interface ModuleShape {
  onAppCreate?: Array<(modules: Module, appReloaded?: boolean) => void>;
  onAppDispose?: Array<(modules: Module, data: any) => void>;
}
interface Module extends ModuleShape {}
class Module {
  constructor(...modules: ModuleShape[]) {
    foldTo(this, modules);
  }

  public triggerOnAppDispose(data: any) {
    try {
      if (this.onAppDispose) {
        this.onAppDispose.forEach(callback => callback(this, data));
      }
      module.hot.data = module.hot.data || {};
    } catch (e) {
      console.error('Error during app dispose', e);
    }
  }

  public triggerOnAppCreate() {
    if (this.onAppCreate) {
      this.onAppCreate.forEach(callback => callback(this, !!module.hot && !!module.hot.data));
    }
  }
}

export default Module;
