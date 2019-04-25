import express from 'express';
import ServerModule, { MiddlewareFunc } from '@gqlapp/module-server-ts';

type ApplyMiddleWare = (fn: MiddlewareFunc) => void;

export const createApiApp = (modules: ServerModule) => {
  const app = express();
  // Don't rate limit heroku
  app.enable('trust proxy');
  const { beforeware, middleware } = modules;
  const applyMiddleWare: ApplyMiddleWare = fn => fn(app, modules.appContext);

  beforeware.forEach(applyMiddleWare);
  middleware.forEach(applyMiddleWare);

  return app;
};
