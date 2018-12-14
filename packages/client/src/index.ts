import modules from './modules';

modules.triggerOnAppCreate();

if (module.hot) {
  module.hot.dispose(modules.triggerOnAppDispose.bind(modules));
  if (__CLIENT__) {
    module.hot.accept();
  }
}

export default modules;
