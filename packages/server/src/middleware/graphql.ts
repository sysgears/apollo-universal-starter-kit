import { GraphQLOptions } from 'apollo-server-core';
import { graphqlExpress } from 'apollo-server-express';
import { Request } from 'express';
import 'isomorphic-fetch';

import settings from '../../settings';
import log from '../../../common/log';
import schema from '../api/schema';
import modules from '../modules';

export default graphqlExpress(async (req: Request) => {
  let result: GraphQLOptions;
  try {
    result = {
      schema,
      context: await modules.createContext(req),
      tracing: !!settings.analytics.apolloEngine.key,
      cacheControl: !!settings.analytics.apolloEngine.key
    };
  } catch (e) {
    log(e.stack);
  }
  return result;
});
