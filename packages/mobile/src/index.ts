try {
  // tslint:disable-next-line
  const modules = require('.').default;
  modules.triggerOnAppCreate();
} catch (e) {
  if (typeof ErrorUtils !== 'undefined') {
    (ErrorUtils as any).reportFatalError(e);
  } else {
    console.error(e);
  }
}
