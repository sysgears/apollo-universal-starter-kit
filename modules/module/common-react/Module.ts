import { foldTo, getParts } from 'fractal-objects';

export default class Module {
  constructor(...modules: Module[]) {
    foldTo(this, modules);
    getParts(this).forEach((module: any) => (module.modules = this));
  }
}
