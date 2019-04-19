import { makeExecutableSchema } from 'graphql-tools';
import ServerModule from '@gqlapp/module-server-ts';

import { pubsub, rootSchemaDef } from '.';

export const createSchema = (modules: ServerModule) =>
  makeExecutableSchema({
    typeDefs: [rootSchemaDef].concat(modules.schema),
    resolvers: modules.createResolvers(pubsub)
  });
