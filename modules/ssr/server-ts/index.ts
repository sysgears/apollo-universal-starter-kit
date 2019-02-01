import path from 'path';
import { Express, Request, Response } from 'express';
import { SharedOptions } from '@gqlapp/module-server-ts';
import SsrModule from './SsrModule';
const reactRenderer = require('./react').default;

const renderServerSide = (sharedOptions: SharedOptions) => async (
  req: Request,
  res: Response,
  next: (e?: Error) => void
) => {
  const { schema, modules } = sharedOptions;

  try {
    if (!req.path.includes('.') && __SSR__) {
      return reactRenderer(req, res, schema, modules);
    } else if (!__SSR__ && req.method === 'GET') {
      res.sendFile(path.resolve(__FRONTEND_BUILD_DIR__, 'index.html'));
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const middleware = (app: Express, sharedOptions: SharedOptions) => {
  app.use(renderServerSide(sharedOptions));
};

export default new SsrModule({
  middleware: [middleware]
});
