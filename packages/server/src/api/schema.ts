import { addErrorLoggingToSchema, makeExecutableSchema } from 'graphql-tools';

import log from '../../../common/log';
import modules from '../modules';
import pubsub from './pubsub';
import * as rootSchemaDef from './rootSchema.graphqls';

const executableSchema = makeExecutableSchema({
  typeDefs: [rootSchemaDef].concat(modules.schemas),
  resolvers: modules.createResolvers(pubsub)
});

addErrorLoggingToSchema(executableSchema, { log: e => log.error(e) });

export default executableSchema;
