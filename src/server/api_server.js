import express from 'express';
import bodyParser from 'body-parser'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import http from 'http'

import { app as settings } from '../../package.json'
import log from '../log'

// Hot reloadable modules
var websiteMiddleware = require('./middleware/website').default;
var graphiqlMiddleware = require('./middleware/graphiql').default;
var graphqlMiddleware = require('./middleware/graphql').default;
var subscriptionManager = require('./api/subscriptions').subscriptionManager;

var server;

const app = express();

const port = process.env.PORT || settings.apiPort;

// Don't rate limit heroku
app.enable('trust proxy');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', express.static(settings.frontendBuildDir, {maxAge: '180 days'}));

app.use('/graphql', (...args) => graphqlMiddleware(...args));
app.use('/graphiql', (...args) => graphiqlMiddleware(...args));
app.use((...args) => websiteMiddleware(...args));

server = http.createServer(app);

new SubscriptionServer({
  subscriptionManager
}, {
  server: server,
  path: '/'
});

server.listen(port, () => {
  log.info(`API is now running on port ${port}`);
});

server.on('close', () => {
  server = undefined;
});

if (module.hot) {
  try {
    module.hot.dispose(() => {
      if (server) {
        server.close();
      }
    });

    module.hot.accept();

    // Reload reloadable modules
    module.hot.accept('./middleware/website', () => { websiteMiddleware = require('./middleware/website').default; });
    module.hot.accept('./middleware/graphql', () => { graphqlMiddleware = require('./middleware/graphql').default; });
    module.hot.accept('./middleware/graphiql', () => { graphiqlMiddleware = require('./middleware/graphiql').default; });
    module.hot.accept('./api/subscriptions', () => { subscriptionManager = require('./api/subscriptions').subscriptionManager; });
  } catch (err) {
    log(err.stack);
  }
}
