import express, { Express } from 'express';
import path from 'path';
import { GraphQLSchema } from 'graphql';

import { isApiExternal } from '@gqlapp/core-common';
import ServerModule, { TWare } from '@gqlapp/module-server-ts';

import graphiqlMiddleware from './middleware/graphiql';
import createApolloServer from './graphql';
import errorMiddleware from './middleware/error';

type TApplyWare = (ware: TWare) => void;

export const createServerApp = (schema: GraphQLSchema, modules: ServerModule) => {
  const app: Express = express();
  // Don't rate limit heroku
  app.enable('trust proxy');
  const { appContext, createContext, beforeware, middleware } = modules;
  const applyWare: TApplyWare = ware => ware(app, appContext, { createContext, schema });

  beforeware.forEach(applyWare);
  middleware.forEach(applyWare);

  if (__DEV__) {
    app.get('/servdir', (req, res) => res.send(process.cwd() + path.sep));
  }

  if (!isApiExternal) {
    const graphqlServer = createApolloServer(schema, modules);
    graphqlServer.applyMiddleware({ app, path: __API_URL__, cors: { credentials: true, origin: true } });
  }

  app.get('/graphiql', (req, res, next) => graphiqlMiddleware(req, res, next));
  app.use('/', express.static(__FRONTEND_BUILD_DIR__, { maxAge: '180 days' }));

  if (__DEV__) {
    app.use('/', express.static(__DLL_BUILD_DIR__, { maxAge: '180 days' }));
    app.use(errorMiddleware);
  }
  return app;
};
