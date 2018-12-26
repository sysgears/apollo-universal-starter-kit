import express from 'express';
import path from 'path';
import { GraphQLSchema } from 'graphql';
import { isApiExternal } from '@module/core-common';
import ServerModule from '@module/module-server-ts';

import middleware from './middleware';
import { createApolloServer } from './graphql';

export const createServerApp = (schema: GraphQLSchema, modules: ServerModule) => {
  const app = express();
  // Don't rate limit heroku
  app.enable('trust proxy');

  modules.beforeware.forEach(applyBeforeware => applyBeforeware(app));
  modules.middleware.forEach(applyMiddleware => applyMiddleware(app));

  if (__DEV__) {
    app.get('/servdir', (req, res) => res.send(process.cwd() + path.sep));
  }

  if (!isApiExternal) {
    const graphqlServer = createApolloServer(schema, modules);
    graphqlServer.applyMiddleware({ app, path: __API_URL__, cors: { credentials: true, origin: true } });
  }

  app.get('/graphiql', (req, res, next) => middleware.graphiql(req, res, next));

  app.use(middleware.website(schema, modules));
  app.use('/', express.static(__FRONTEND_BUILD_DIR__, { maxAge: '180 days' }));

  if (__DEV__) {
    app.use('/', express.static(__DLL_BUILD_DIR__, { maxAge: '180 days' }));
    app.use(middleware.error);
  }
  return app;
};
