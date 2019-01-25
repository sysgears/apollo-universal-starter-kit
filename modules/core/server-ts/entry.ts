import { log } from '@gqlapp/core-common';
export { createServer, serverPromise } from './server';

process.on('uncaughtException', ex => {
  log.error(ex);
  process.exit(1);
});

process.on('unhandledRejection', reason => {
  log.error(reason);
});
