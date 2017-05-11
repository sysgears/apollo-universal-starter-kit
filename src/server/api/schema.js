import { makeExecutableSchema, addErrorLoggingToSchema } from 'graphql-tools';
import { PubSub } from 'graphql-subscriptions';

import rootSchemaDef from './root_schema.graphqls';
import modules from '../modules';
import log from '../../common/log';
import { app as settings } from '../../../package.json';
import { addApolloLogging } from '../../common/apollo_logger';

export const pubsub = settings.apolloLogging ? addApolloLogging(new PubSub()) : new PubSub();

const executableSchema = makeExecutableSchema({
  typeDefs: [rootSchemaDef].concat(modules.schemas),
  resolvers: modules.createResolvers(pubsub),
});

addErrorLoggingToSchema(executableSchema, { log: (e) => log.error(e) });

export default executableSchema;
