import express from 'express';
import path from 'path';
import { GraphQLSchema } from 'graphql';
import { isApiExternal } from '@gqlapp/core-common';
import { SsrModule } from '@gqlapp/ssr-server-ts';

import graphiqlMiddleware from './middleware/graphiql';
import createApolloServer from './graphql';
import errorMiddleware from './middleware/error';

export interface Modules extends SsrModule {}

export const createServerApp = (schema: GraphQLSchema, modules: Modules) => {
  const app = express();
  // Don't rate limit heroku
  app.enable('trust proxy');

  const sharedOptions = {
    schema,
    modules
  };

  modules.beforeware.forEach(applyBeforeware => applyBeforeware(app, sharedOptions));
  modules.middleware.forEach(applyMiddleware => applyMiddleware(app, sharedOptions));

  if (__DEV__) {
    app.get('/servdir', (req, res) => res.send(process.cwd() + path.sep));
  }

  if (!isApiExternal) {
    const graphqlServer = createApolloServer(schema, modules);
    graphqlServer.applyMiddleware({ app, path: __API_URL__, cors: { credentials: true, origin: true } });
  }

  app.get('/graphiql', graphiqlMiddleware);

  if (modules.ssr) {
    modules.ssr(app, sharedOptions);
  }

  app.use('/', express.static(__FRONTEND_BUILD_DIR__, { maxAge: '180 days' }));

  if (__DEV__) {
    app.use('/', express.static(__DLL_BUILD_DIR__, { maxAge: '180 days' }));
    app.use(errorMiddleware);
  }

  return app;
};
