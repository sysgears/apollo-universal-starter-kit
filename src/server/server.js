import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import http from 'http';
import { invert, isArray } from 'lodash';
import url from 'url';
import cookiesMiddleware from 'universal-cookie-express';
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies, import/extensions
import queryMap from 'persisted_queries.json';
import modules from './modules';

import websiteMiddleware from './middleware/website';
import graphiqlMiddleware from './middleware/graphiql';
import graphqlMiddleware from './middleware/graphql';
import errorMiddleware from './middleware/error';
import addGraphQLSubscriptions from './api/subscriptions';
import log from '../common/log';

// eslint-disable-next-line import/no-mutable-exports
let server;

const app = express();

for (const applyBeforeware of modules.beforewares) {
  applyBeforeware(app);
}

app.use(cookiesMiddleware());

const { port, pathname } = url.parse(__BACKEND_URL__);
const serverPort = process.env.PORT || port || 8080;

// Don't rate limit heroku
app.enable('trust proxy');

const corsOptions = {
  credentials: true
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  '/',
  express.static(__FRONTEND_BUILD_DIR__, {
    maxAge: '180 days'
  })
);

if (__DEV__) {
  app.use('/', express.static(__DLL_BUILD_DIR__, { maxAge: '180 days' }));
}

if (__PERSIST_GQL__) {
  const invertedMap = invert(queryMap);

  app.use(pathname, (req, resp, next) => {
    if (isArray(req.body)) {
      req.body = req.body.map(body => {
        return {
          query: invertedMap[body.id],
          ...body
        };
      });
      next();
    } else {
      if (!__DEV__ || (req.get('Referer') || '').indexOf('/graphiql') < 0) {
        resp.status(500).send('Unknown GraphQL query has been received, rejecting...');
      } else {
        next();
      }
    }
  });
}

for (const applyMiddleware of modules.middlewares) {
  applyMiddleware(app);
}

if (__DEV__) {
  app.use('/servdir', (req, res) => {
    res.send(process.cwd() + path.sep);
  });
}
app.use(pathname, (...args) => graphqlMiddleware(...args));
app.use('/graphiql', (...args) => graphiqlMiddleware(...args));
app.use((...args) => websiteMiddleware(queryMap)(...args));
if (__DEV__) {
  app.use(errorMiddleware);
}

server = http.createServer(app);

addGraphQLSubscriptions(server);

server.listen(serverPort, () => {
  log.info(`API is now running on port ${serverPort}`);
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
  module.hot.accept(['./middleware/website', './middleware/graphql']);
  module.hot.accept(['./api/subscriptions'], () => {
    try {
      addGraphQLSubscriptions(server);
    } catch (error) {
      log(error.stack);
    }
  });

  module.hot.accept();
}

export default server;
