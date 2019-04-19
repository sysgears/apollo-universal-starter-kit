import { makeExecutableSchema } from 'graphql-tools';

import { pubsub, rootSchemaDef } from '.';
import { GraphQLServerModule } from '..';

export const createSchema = (modules: GraphQLServerModule) =>
  makeExecutableSchema({
    typeDefs: [rootSchemaDef].concat(modules.schema),
    resolvers: modules.createResolvers(pubsub)
  });
