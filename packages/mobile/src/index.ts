try {
  // tslint:disable-next-line
  const modules = require('./modules').default;
  modules.createApp(module);
} catch (e) {
  if (typeof ErrorUtils !== 'undefined') {
    (ErrorUtils as any).reportFatalError(e);
  } else {
    console.error(e);
  }
}
