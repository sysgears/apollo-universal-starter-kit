import http from 'http';
import { serverPort, log } from '@gqlapp/core-common';
import ServerModule from '@gqlapp/module-server-ts';
import { addGraphQLSubscriptions, onAppDispose } from '@gqlapp/graphql-server-server-ts';

import { createServerApp } from './app';

let server: http.Server;

const ref: { modules: ServerModule; resolve: (server: http.Server) => void } = {
  modules: null,
  resolve: null
};

export const serverPromise: Promise<http.Server> = new Promise(resolve => (ref.resolve = resolve));

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
      entryModule.hot.dispose(data => onAppDispose(modules, data));
      entryModule.hot.status(reloadBackEnd);
      entryModule.hot.accept();
    }

    if (isStarting) {
      const app = createServerApp(modules);
      server = http.createServer(app);

      addGraphQLSubscriptions(server, modules);

      server.listen(serverPort, () => {
        log.info(`API is now running on port ${serverPort}`);
        ref.resolve(server);
      });

      server.on('close', () => (server = null));
    } else {
      const app = createServerApp(modules);
      server = http.createServer(app);
      addGraphQLSubscriptions(server, ref.modules, entryModule);
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
