import express from 'express';
import path from 'path';
import { GraphQLSchema } from 'graphql';
import sofa, { OpenAPI } from 'sofa-api';

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

  modules.beforeware.forEach(applyBeforeware => applyBeforeware(app));
  modules.middleware.forEach(applyMiddleware => applyMiddleware(app));

  if (__DEV__) {
    app.get('/servdir', (req, res) => res.send(process.cwd() + path.sep));
  }

  if (!isApiExternal) {
    const graphqlServer = createApolloServer(schema, modules);
    graphqlServer.applyMiddleware({ app, path: __API_URL__, cors: { credentials: true, origin: true } });
  }

  const openApi = OpenAPI({
    schema,
    info: {
      title: 'Example API',
      version: '3.0.0'
    }
  });

  app.use(
    '/api',
    sofa({
      schema,
      onRoute: info => {
        // console.log(info);
        openApi.addRoute(info, {
          basePath: '/api'
        });
      },
      context: async ({ req, res }) => {
        return modules.createContext(req, res);
      }
    })
  );

  // writes every recorder route
  openApi.save('./swagger.yml');

  app.get('/graphiql', (req, res, next) => graphiqlMiddleware(req, res, next));
  app.use(websiteMiddleware(schema, modules));
  app.use('/', express.static(__FRONTEND_BUILD_DIR__, { maxAge: '180 days' }));

  if (__DEV__) {
    app.use('/', express.static(__DLL_BUILD_DIR__, { maxAge: '180 days' }));
    app.use(errorMiddleware);
  }
  return app;
};
