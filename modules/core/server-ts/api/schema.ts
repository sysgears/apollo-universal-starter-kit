import { makeExecutableSchema } from 'graphql-tools';
import ServerModule from '@gqlapp/module-server-ts';
import { ROOT_SCHEMA } from '@gqlapp/core-common/graphql';

import pubsub from './pubsub';

export const createSchema = (modules: ServerModule) =>
  makeExecutableSchema({
    typeDefs: [ROOT_SCHEMA].concat(modules.schema),
    resolvers: modules.createResolvers(pubsub)
  });
