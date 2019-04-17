import express from 'express';
import path from 'path';
import { GraphQLSchema } from 'graphql';
import ServerModule, { MiddlewareFunc, CreateGraphQLContext } from '@gqlapp/module-server-ts';

import websiteMiddleware from './middleware/website';
import errorMiddleware from './middleware/error';

type ApplyMiddleWare = (fn: MiddlewareFunc) => void;

export const createServerApp = (schema: GraphQLSchema, modules: ServerModule) => {
  const app = express();
  // Don't rate limit heroku
  app.enable('trust proxy');
  const { appContext, beforeware, middleware } = modules;
  const createGraphQLContext: CreateGraphQLContext = (req, res) => modules.createContext(req, res);
  const applyMiddleWare: ApplyMiddleWare = fn => fn(app, appContext, { createGraphQLContext, schema });

  beforeware.forEach(applyMiddleWare);
  middleware.forEach(applyMiddleWare);

  app.use(websiteMiddleware(schema, modules));
  app.use('/', express.static(__FRONTEND_BUILD_DIR__, { maxAge: '180 days' }));

  if (__DEV__) {
    app.use('/', express.static(__DLL_BUILD_DIR__, { maxAge: '180 days' }));
    app.get('/servdir', (req, res) => res.send(process.cwd() + path.sep));
    app.use(errorMiddleware);
  }

  return app;
};
