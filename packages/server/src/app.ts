import express from 'express';
import path from 'path';

import { isApiExternal } from './net';
import modules from './modules';
import graphiqlMiddleware from './middleware/graphiql';
import websiteMiddleware from './middleware/website';
import createApolloServer from './graphql';
import errorMiddleware from './middleware/error';

const app = express();
// Don't rate limit heroku
app.enable('trust proxy');

modules.beforeware.forEach(applyBeforeware => applyBeforeware(app));
modules.middleware.forEach(applyMiddleware => applyMiddleware(app));

if (__DEV__) {
  app.get('/servdir', (req, res) => res.send(process.cwd() + path.sep));
}

if (!isApiExternal) {
  const graphqlServer = createApolloServer();
  graphqlServer.applyMiddleware({ app, path: __API_URL__, cors: { credentials: true, origin: true } });
}

app.get('/graphiql', (req, res, next) => graphiqlMiddleware(req, res, next));
app.use(websiteMiddleware);
app.use('/', express.static(__FRONTEND_BUILD_DIR__, { maxAge: '180 days' }));

if (__DEV__) {
  app.use('/', express.static(__DLL_BUILD_DIR__, { maxAge: '180 days' }));
  app.use(errorMiddleware);
}

export default app;
