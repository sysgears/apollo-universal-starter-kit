import path from 'path';
import { GraphQLSchema } from 'graphql';
import ServerModule from '@gqlapp/module-server-ts';
import reactRenderer from './react';

const renderServerSide = (schema: GraphQLSchema, modules: ServerModule) => async (
  req: any,
  res: any,
  next: (e?: Error) => void
) => {
  if (!__SSR__) {
    next();
  }

  try {
    if (!req.path.includes('.')) {
      return await reactRenderer(req, res, schema, modules);
    } else if (!__SSR__ && req.method === 'GET') {
      res.sendFile(path.resolve(__FRONTEND_BUILD_DIR__, 'index.html'));
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

export default renderServerSide;
