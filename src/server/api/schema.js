import { makeExecutableSchema, addErrorLoggingToSchema } from 'graphql-tools';
import { PubSub } from 'graphql-subscriptions';

import rootSchemaDef from './root_schema.graphqls';
import { graphQLSchemas, createResolvers } from '../modules';
import log from '../../common/log';

export const pubsub = new PubSub();

const executableSchema = makeExecutableSchema({
  typeDefs: [ rootSchemaDef ].concat(graphQLSchemas),
  resolvers: createResolvers(pubsub),
});

addErrorLoggingToSchema(executableSchema, { log: (e) => log.error(e) });

export default executableSchema;
