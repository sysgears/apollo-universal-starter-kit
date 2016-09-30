import { createServer } from 'http'
import { SubscriptionServer } from 'subscriptions-transport-ws'

import { app as settings } from '../../package.json'

// Hot reloadable modules
var subscriptionManager = require('./api/subscriptions').subscriptionManager;

import log from '../log'

var server;

const port = process.env.WS_PORT || settings.wsPort;

const websocketServer = createServer((req, res) => {
  res.writeHead(404);
  res.end();
});

server = websocketServer.listen(port, () => log(
  `WebSocket Server is now running on port ${port}`
));

server.on('close', () => {
  server = undefined;
});

new SubscriptionServer({
  subscriptionManager
}, websocketServer);

if (module.hot) {
  try {
    module.hot.dispose(() => {
      if (server) {
        server.close();
      }
    });

    module.hot.accept();

    // Reload reloadable modules
    module.hot.accept('./api/subscriptions', () => { subscriptionManager = require('./api/subscriptions').subscriptionManager; });
  } catch (err) {
    log(err.stack);
  }
}
