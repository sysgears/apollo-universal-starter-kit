import express from 'express';
import compression from 'compression';
import path from 'path';
import { GraphQLSchema } from 'graphql';

import { isApiExternal } from '@gqlapp/core-common';
import ServerModule from '@gqlapp/module-server-ts';

import graphiqlMiddleware from './middleware/graphiql';
import websiteMiddleware from './middleware/website';
import createApolloServer from './graphql';
import errorMiddleware from './middleware/error';

export const createServerApp = (schema: GraphQLSchema, modules: ServerModule) => {
  const app = express();
  // Don't rate limit heroku
  app.enable('trust proxy');

  if (!__DEV__) {
    app.use(compression());
  }

  (modules.beforeware || []).forEach((applyBeforeware) => applyBeforeware(app, modules.appContext));
  (modules.middleware || []).forEach((applyMiddleware) => applyMiddleware(app, modules.appContext));

  if (__DEV__) {
    app.get('/servdir', (req, res) => res.send(process.cwd() + path.sep));
  }

  if (!isApiExternal) {
    const graphqlServer = createApolloServer(schema, modules);
    graphqlServer.applyMiddleware({ app, path: __API_URL__, cors: { credentials: true, origin: true } });
  }

  app.get('/graphiql', (req, res, next) => graphiqlMiddleware(req, res, next));
  app.use(websiteMiddleware(schema, modules));
  app.use('/', express.static(__FRONTEND_BUILD_DIR__, { maxAge: '180 days' }));

  if (__DEV__) {
    app.use(errorMiddleware);
  }
  return app;
};
