import { addApolloLogging } from 'apollo-logger';
import { PubSub } from 'graphql-subscriptions';
import { addErrorLoggingToSchema, makeExecutableSchema } from 'graphql-tools';

import settings from '../../../settings';
import log from '../../common/log';
import modules from '../modules';
import * as rootSchemaDef from './rootSchema.graphqls';

export const pubsub = settings.apolloLogging ? addApolloLogging(new PubSub()) : new PubSub();

const executableSchema = makeExecutableSchema({
  typeDefs: [rootSchemaDef].concat(modules.schemas),
  resolvers: modules.createResolvers(pubsub)
});

addErrorLoggingToSchema(executableSchema, { log: e => log.error(e) });

export default executableSchema;
