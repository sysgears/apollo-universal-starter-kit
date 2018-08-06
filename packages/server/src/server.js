import http from 'http';

import { serverPort } from './net';
import app, { graphqlServer } from './app';
import log from '../../common/log';

// eslint-disable-next-line import/no-mutable-exports
let server;

server = http.createServer();
server.on('request', app);
graphqlServer.installSubscriptionHandlers(server);

const serverPromise = new Promise(resolve => {
  server.listen(serverPort, () => {
    log.info(`API is now running on port ${serverPort}`);
    resolve(server);
  });
});

server.on('close', () => {
  server = undefined;
});

if (module.hot) {
  module.hot.dispose(() => {
    try {
      if (server) {
        server.close();
      }
    } catch (error) {
      log(error.stack);
    }
  });
  module.hot.accept(['./app'], () => {
    try {
      server.removeAllListeners('request');
      server.on('request', app);
      graphqlServer.installSubscriptionHandlers(server);
    } catch (error) {
      log(error.stack);
    }
  });
  module.hot.accept();
}

export default serverPromise;
