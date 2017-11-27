import { graphqlExpress } from 'apollo-server-express';
import 'isomorphic-fetch';

import schema from '../api/schema';
import modules from '../modules';
import settings from '../../../settings';

export default graphqlExpress(async (req, res, next) => {
  try {
    return {
      schema,
      context: await modules.createContext(req, res),
      tracing: !!settings.analytics.apolloEngine.key,
      cacheControl: !!settings.analytics.apolloEngine.key
    };
  } catch (e) {
    next(e);
  }
});
