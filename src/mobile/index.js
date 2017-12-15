/* eslint-disable no-undef */
try {
  require('./AwakeInDevApp');
} catch (e) {
  if (ErrorUtils !== 'undefined') {
    ErrorUtils.reportFatalError(e);
  } else {
    console.error(e);
  }
}
