import express from 'express';
import http from 'http';
import url from 'url';

import log from '../common/log';

import middleware from './middleware';
import addGraphQLSubscriptions from './api/subscriptions';

// eslint-disable-next-line import/no-mutable-exports
let server;

/* Create the Express Server */
const app = express();

// Don't rate limit heroku
app.enable('trust proxy');

// Add Middleware
middleware.ApplyMiddleware(app);

// Create the server
server = http.createServer(app);

// Add the subscriptions
addGraphQLSubscriptions(server);

// Start the server
const { port } = url.parse(__BACKEND_URL__);
const serverPort = process.env.PORT || port || 8080;

server.listen(serverPort, () => {
  log.info(`API is now running on port ${serverPort}`);
});

// delete server on close event
server.on('close', () => {
  server = undefined;
});

// setup server hotloading
if (module.hot) {
  // dispose
  module.hot.dispose(() => {
    try {
      if (server) {
        server.close();
      }
    } catch (error) {
      log(error.stack);
    }
  });

  // still accept
  module.hot.accept(['./middleware/server-side-render', './middleware/graphql']);
  module.hot.accept(['./api/subscriptions'], () => {
    try {
      addGraphQLSubscriptions(server);
    } catch (error) {
      log(error.stack);
    }
  });

  // start accepting again
  module.hot.accept();
}

export default server;
