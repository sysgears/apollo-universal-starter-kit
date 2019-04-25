import express from 'express';
import path from 'path';
import ServerModule from '@gqlapp/module-server-ts';

// import websiteMiddleware from './middleware/website';
import errorMiddleware from './middleware/error';

export const createClientApp = (modules: ServerModule) => {
  const app = express();
  // Don't rate limit heroku
  app.enable('trust proxy');
  app.use('/', express.static(__FRONTEND_BUILD_DIR__, { maxAge: '180 days' }));

  if (__DEV__) {
    app.use('/', express.static(__DLL_BUILD_DIR__, { maxAge: '180 days' }));
    app.get('/servdir', (req, res) => res.send(process.cwd() + path.sep));
    app.use(errorMiddleware);
  }

  return app;
};
