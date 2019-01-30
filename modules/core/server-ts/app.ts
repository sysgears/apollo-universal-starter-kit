import express, { Express } from 'express';
import path from 'path';
import { SharedOptions } from '@gqlapp/module-server-ts';

import graphiqlMiddleware from './middleware/graphiql';
import errorMiddleware from './middleware/error';

export const createServerApp = (sharedOptions: SharedOptions) => {
  const { modules } = sharedOptions;
  const app: Express = express();

  // Don't rate limit heroku
  app.enable('trust proxy');
  modules.beforeware.forEach(applyBeforeware => applyBeforeware(app, sharedOptions));
  modules.middleware.forEach(applyMiddleware => applyMiddleware(app, sharedOptions));

  app.get('/graphiql', graphiqlMiddleware);
  app.use('/', express.static(__FRONTEND_BUILD_DIR__, { maxAge: '180 days' }));

  if (__DEV__) {
    app.use('/', express.static(__DLL_BUILD_DIR__, { maxAge: '180 days' }));
    app.get('/servdir', (req, res) => res.send(process.cwd() + path.sep));
    app.use(errorMiddleware);
  }

  return app;
};
