import http, { Server } from 'http';
import { clientPort, log } from '@gqlapp/core-common';
import ServerModule from '@gqlapp/module-server-ts';

import { createClientApp } from './app';

let server: Server;

const ref: { modules: ServerModule; resolve: (server: Server) => void } = {
  modules: null,
  resolve: null
};

export const serverPromise: Promise<Server> = new Promise(resolve => (ref.resolve = resolve));

const reloadBackEnd = (event: any): void => {
  if (event === 'abort' || event === 'fail') {
    console.error('HMR error status: ' + event);
    // Signal webpack.run.js to do full-reload of the back-end
    process.exit(250);
  }
};

export const createServer = (modules: ServerModule, entryModule: NodeModule) => {
  try {
    ref.modules = modules;
    const isStarting = !server || !entryModule.hot || !entryModule.hot.data;

    if (entryModule.hot) {
      entryModule.hot.status(reloadBackEnd);
      entryModule.hot.accept();
    }

    if (isStarting) {
      const app = createClientApp(modules);
      server = http.createServer(app);

      server.listen(clientPort, () => {
        log.info(`Client is now running on port ${clientPort}`);
        ref.resolve(server);
      });

      server.on('close', () => (server = null));
    } else {
      const app = createClientApp(modules);
      server = http.createServer(app);
    }
  } catch (e) {
    log.error(e);
  }
};

if (module.hot) {
  module.hot.dispose(() => {
    // Shutdown server if changes to this module code are made
    // So that it was started afresh
    try {
      if (server) {
        server.close();
        server = null;
      }
    } catch (error) {
      log(error.stack);
    }
  });
}
