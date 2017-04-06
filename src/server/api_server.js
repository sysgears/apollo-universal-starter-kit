import express from 'express';
import bodyParser from 'body-parser';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import http from 'http';
import { invert } from 'lodash';

import { app as settings } from '../../package.json';
import log from '../log';

// Hot reloadable modules
let websiteMiddleware = require('./middleware/website').default;
let graphiqlMiddleware = require('./middleware/graphiql').default;
let graphqlMiddleware = require('./middleware/graphql').default;
let subscriptionManager = require('./api/subscriptions').subscriptionManager;

let server;

const app = express();

const port = process.env.PORT || settings.apiPort;

// Don't rate limit heroku
app.enable('trust proxy');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', express.static(settings.frontendBuildDir, { maxAge: '180 days' }));

let queryMap = null;
if (settings.persistGraphQL) {
  // eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
  queryMap = require('persisted_queries.json');
  const invertedMap = invert(queryMap);

  app.use(
    '/graphql',
    (req, resp, next) => {

      req.body = req.body.map(body => {
        return {
          query: invertedMap[ body.id ],
          ...body
        };
      });

      next();
    },
  );
}

app.use('/graphql', (...args) => graphqlMiddleware(...args));
app.use('/graphiql', (...args) => graphiqlMiddleware(...args));
app.use((...args) => websiteMiddleware(queryMap)(...args));

server = http.createServer(app);

let subscriptionServerConfig = {
  server: server,
  path: '/'
};

let subscriptionServer = new SubscriptionServer({
  subscriptionManager
}, subscriptionServerConfig);

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
    module.hot.accept('./middleware/website', () => {
      websiteMiddleware = require('./middleware/website').default;
    });
    module.hot.accept([ './middleware/graphql', './api/subscriptions' ], () => {
      try {
        graphqlMiddleware = require('./middleware/graphql').default;

        subscriptionManager = require('./api/subscriptions').subscriptionManager;

        log.debug('Reloading the subscription server.');

        if (subscriptionServer && subscriptionServer.wsServer) {
          subscriptionServer.wsServer.close(() => {
            subscriptionServer = new SubscriptionServer({
              subscriptionManager
            }, subscriptionServerConfig);
          });
        }
      } catch (error) {
        log(error.stack);
      }
    });
    module.hot.accept('./middleware/graphiql', () => {
      graphiqlMiddleware = require('./middleware/graphiql').default;
    });
  } catch (err) {
    log(err.stack);
  }
}
