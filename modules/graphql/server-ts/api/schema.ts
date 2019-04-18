import { makeExecutableSchema } from 'graphql-tools';

import { pubsub, rootSchemaDef } from '.';
import { GraphQLModule } from '..';

export const createSchema = (modules: GraphQLModule) =>
  makeExecutableSchema({
    typeDefs: [rootSchemaDef].concat(modules.schema),
    resolvers: modules.createResolvers(pubsub)
  });
