import express, { Express } from 'express';
import path from 'path';
import { GraphQLSchema } from 'graphql';
import ServerModule, { TWare, TCreateGraphQLContext } from '@gqlapp/module-server-ts';

import errorMiddleware from './middleware/error';

type TApplyWare = (ware: TWare) => void;

export const createServerApp = (schema: GraphQLSchema, modules: ServerModule) => {
  const app: Express = express();
  // Don't rate limit heroku
  app.enable('trust proxy');
  const { appContext, beforeware, middleware } = modules;
  const createGraphQLContext: TCreateGraphQLContext = (req, res) => modules.createContext(req, res);
  const applyWare: TApplyWare = ware => ware(app, appContext, { createGraphQLContext, schema });

  beforeware.forEach(applyWare);
  middleware.forEach(applyWare);

  app.use('/', express.static(__FRONTEND_BUILD_DIR__, { maxAge: '180 days' }));

  if (__DEV__) {
    app.use('/', express.static(__DLL_BUILD_DIR__, { maxAge: '180 days' }));
    app.get('/servdir', (req, res) => res.send(process.cwd() + path.sep));
    app.use(errorMiddleware);
  }

  return app;
};
