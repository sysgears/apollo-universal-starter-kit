import { graphqlExpress } from 'apollo-server-express';
import 'isomorphic-fetch';

import log from '../../common/log';
import schema from '../api/schema';
import modules from '../modules';
import settings from '../../../settings';

export default graphqlExpress(async req => {
  try {
    return {
      schema,
      context: await modules.createContext(req),
      tracing: !!settings.analytics.apolloEngine.key,
      cacheControl: !!settings.analytics.apolloEngine.key
    };
  } catch (e) {
    log(e.stack);
  }
});
