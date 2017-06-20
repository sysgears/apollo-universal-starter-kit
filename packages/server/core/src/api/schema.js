import { makeExecutableSchema, addErrorLoggingToSchema } from 'graphql-tools';
import { addApolloLogging } from 'apollo-logger';
import { PubSub } from 'graphql-subscriptions';

import rootSchemaDef from './root_schema.graphqls';
import modules from '../modules';
import log from '../../../../common/log';
import { app as settings } from '../../app.json';

export const pubsub = settings.apolloLogging ? addApolloLogging(new PubSub()) : new PubSub();

const executableSchema = makeExecutableSchema({
  typeDefs: [rootSchemaDef].concat(modules.schemas),
  resolvers: modules.createResolvers(pubsub),
});

addErrorLoggingToSchema(executableSchema, { log: (e) => log.error(e) });

export default executableSchema;
