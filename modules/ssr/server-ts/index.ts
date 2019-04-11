import path from 'path';
import { Request, Response } from 'express';
import SsrModule from './SsrModule';
import reactRenderer from './react';
import { TWare, GraphQLConfig } from '@gqlapp/module-server-ts';

const renderServerSide = (graphQLConfig: GraphQLConfig) => async (
  req: Request,
  res: Response,
  next: (e?: Error) => void
) => {
  const isDocument = req.path.includes('.');
  const preRender = !isDocument && __SSR__;
  const serveEntryFile = !isDocument && !__SSR__ && req.method === 'GET';

  try {
    if (preRender) {
      return reactRenderer(req, res, graphQLConfig);
    } else if (serveEntryFile) {
      return res.sendFile(path.resolve(__FRONTEND_BUILD_DIR__, 'index.html'));
    }

    next();
  } catch (e) {
    next(e);
  }
};

const middleware: TWare = (app, appContext, graphQLConfig) => {
  app.use(renderServerSide(graphQLConfig));
};

export default new SsrModule({
  middleware: [middleware]
});
