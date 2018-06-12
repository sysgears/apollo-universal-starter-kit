import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import cookiesMiddleware from 'universal-cookie-express';

import { isApiExternal } from './net';
import modules from './modules';
import websiteMiddleware from './middleware/website';
import graphiqlMiddleware from './middleware/graphiql';
import graphqlMiddleware from './middleware/graphql';
import errorMiddleware from './middleware/error';

const app = express();

for (const applyBeforeware of modules.beforewares) {
  applyBeforeware(app);
}

app.use(cookiesMiddleware());

// Don't rate limit heroku
app.enable('trust proxy');

const corsOptions = {
  credentials: true,
  origin: true
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

for (const applyMiddleware of modules.middlewares) {
  applyMiddleware(app);
}

if (__DEV__) {
  app.get('/servdir', (req, res) => {
    res.send(process.cwd() + path.sep);
  });
}
if (!isApiExternal) {
  app.post(__API_URL__, (...args) => graphqlMiddleware(...args));
}
app.get('/graphiql', (...args) => graphiqlMiddleware(...args));
app.use((...args) => websiteMiddleware(...args));
if (__DEV__) {
  app.use(errorMiddleware);
}

if (module.hot) {
  module.hot.accept(['./middleware/website', './middleware/graphql']);
}

export default app;
