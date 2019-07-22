/* tslint:disable:no-implicit-dependencies */
import 'core-js/es';
import 'core-js/proposals/reflect-metadata';
import 'zone.js/dist/zone';

if (process.env.ENV === 'production') {
  // Production
} else {
  // Development and test
  Error.stackTraceLimit = Infinity;
  /* tslint:disable:no-var-requires */
  require('zone.js/dist/long-stack-trace-zone');
}
