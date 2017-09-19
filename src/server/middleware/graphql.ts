import { Request } from 'express';
import { graphqlExpress } from 'apollo-server-express';
import { GraphQLOptions } from 'apollo-server-core';
import 'isomorphic-fetch';

import log from '../../common/log';
import schema from '../api/schema';
import modules from '../modules';

export default graphqlExpress(async (req: Request) => {
  let result: GraphQLOptions = {} as GraphQLOptions;
  try {
    result = {
      schema,
      context: await modules.createContext(req)
    } as GraphQLOptions;
  } catch (e) {
    log(e.stack);
  }
  return result;
});
