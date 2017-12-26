import { Counter } from './sql';

import { Feature } from '../connector';
import { createResolvers } from './resolvers';
import * as schema from './schema.graphqls';

export const counterModule = new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => ({ Counter: new Counter() })
});
