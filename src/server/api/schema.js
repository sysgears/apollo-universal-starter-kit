import { makeExecutableSchema, addErrorLoggingToSchema } from 'graphql-tools';

import rootSchemaDef from './rootSchema.graphql';
import modules from '../modules';
import pubsub from './pubsub';

const logger = {
  log: e => {
    console.log(e);
    throw e;
  }
};

const executableSchema = makeExecutableSchema({
  typeDefs: [rootSchemaDef].concat(modules.schemas),
  resolvers: modules.createResolvers(pubsub),
  allowUndefinedInResolve: false,
  logger
});

addErrorLoggingToSchema(executableSchema, logger);

// console.log(executableSchema)

export default executableSchema;
