import path from 'path';
import { GraphQLSchema } from 'graphql';
import { Express } from 'express';
import ServerModule from '@gqlapp/module-server-ts';
import SsrModule from './SsrModule';
import reactRenderer from './react';

const renderServerSide = (schema: GraphQLSchema, modules: ServerModule) => async (
  req: any,
  res: any,
  next: (e?: Error) => void
) => {
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

const middleware = (app: Express, { schema, modules }: any) => {
  app.use(renderServerSide(schema, modules));
};

export { default as SsrModule } from './SsrModule';

export default new SsrModule({
  ssr: middleware
});
