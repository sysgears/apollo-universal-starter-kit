try {
  global.__SERVER__ = false;
  global.__CLIENT__ = true;
  global.__SSR__ = false;
  global.__TEST__ = false;
  global.__API_URL__ = 'http://localhost:8080/graphql';
  global.__WEBSITE_URL__ = 'http://localhost:8080';

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
