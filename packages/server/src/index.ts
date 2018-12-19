import modules from './modules';

modules.triggerOnAppCreate();

if (module.hot) {
  module.hot.dispose(modules.triggerOnAppDispose.bind(modules));
  module.hot.status(event => {
    if (event === 'abort' || event === 'fail') {
      console.error('HMR error status: ' + event);
      // Signal webpack.run.js to do full-reload of the back-end
      process.exit(250);
    }
  });
  module.hot.accept();
}

export default modules;
