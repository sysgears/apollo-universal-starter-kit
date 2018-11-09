import { unfoldTo } from 'fractal-objects';

export default class Module {
  constructor(...modules: Module[]) {
    unfoldTo(this, modules);
  }
}
