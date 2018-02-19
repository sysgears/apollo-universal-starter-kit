try {
  // tslint:disable-next-line
  require('./AwakeInDevApp');
} catch (e) {
  if (typeof ErrorUtils !== 'undefined') {
    ErrorUtils.reportFatalError(e);
  } else {
    console.error(e);
  }
}
