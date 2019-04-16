import path from 'path';
import ServerModule from '@gqlapp/module-server-ts';
import reactRenderer from './react';
import { Ware, GraphQLConfigShape } from '@gqlapp/module-server-ts';

const renderServerSide = (graphQLConfig: GraphQLConfigShape) => async (
  req: any,
  res: any,
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

const middleware: Ware = (app, appContext, graphQLConfig) => {
  app.use(renderServerSide(graphQLConfig));
};

export default new ServerModule({
  middleware: [middleware]
});
