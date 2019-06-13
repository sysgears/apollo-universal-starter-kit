try {
  Object.assign(global, require('../build.config'));

  // tslint:disable-next-line
  const modules = require('./modules').default;
  (async () => {
    await modules.createApp(module);
  })();
} catch (e) {
  if (typeof ErrorUtils !== 'undefined') {
    (ErrorUtils as any).reportFatalError(e);
  } else {
    console.error(e);
  }
}
