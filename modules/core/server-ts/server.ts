import http from 'http';
import { serverPort, log } from '@gqlapp/core-common';
import ServerModule from '@gqlapp/module-server-ts';
import { createSchema } from './api/schema';

import addGraphQLSubscriptions, { onAppDispose } from './api/subscriptions';

import { createServerApp } from './app';

let server: http.Server;

const ref: { modules: ServerModule; resolve: (server: http.Server) => void } = {
  modules: null,
  resolve: null,
};

export const serverPromise: Promise<http.Server> = new Promise((resolve) => (ref.resolve = resolve));

export const createServer = async (modules: ServerModule, entryModule: NodeModule) => {
  try {
    ref.modules = modules;

    if (entryModule.hot) {
      entryModule.hot.dispose((data) => onAppDispose(modules, data));
      entryModule.hot.status((event) => {
        if (event === 'abort' || event === 'fail') {
          console.error(`HMR error status: ${event}`);
          // Signal webpack.run.js to do full-reload of the back-end
          process.exit(250);
        }
      });
      entryModule.hot.accept();
    }

    if (!server || !entryModule.hot || !entryModule.hot.data) {
      server = http.createServer();

      const schema = createSchema(modules);

      server.on('request', createServerApp(schema, modules));
      addGraphQLSubscriptions(server, schema, modules);

      server.listen(serverPort, () => {
        log.info(`API is now running on port ${serverPort}`);
        ref.resolve(server);
      });

      server.on('close', () => {
        server = undefined;
      });
    } else {
      const schema = createSchema(ref.modules);
      server.removeAllListeners('request');
      server.on('request', createServerApp(schema, ref.modules));
      addGraphQLSubscriptions(server, schema, ref.modules, entryModule);
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
        server = undefined;
      }
    } catch (error) {
      log(error.stack);
    }
  });
}
