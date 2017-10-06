import log from '../common/log';
import './server';

process.on('uncaughtException', (ex: any) => {
  log.error(ex);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  log.error(reason);
});

if (module.hot) {
  module.hot.status(event => {
    if (event === 'abort' || event === 'fail') {
      log('HMR error status: ' + event);
      // Signal webpack.run.js to do full-reload of the back-end
      process.exit(250);
    }
  });

  module.hot.accept();
}
