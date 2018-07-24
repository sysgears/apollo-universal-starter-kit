import { makeExecutableSchema } from 'graphql-tools';

import rootSchemaDef from './rootSchema.graphql';
import modules from '../modules';
import pubsub from './pubsub';

export const schemas = {
  typeDefs: [rootSchemaDef].concat(modules.schemas),
  resolvers: modules.createResolvers(pubsub)
};

const executableSchema = makeExecutableSchema(schemas);

export default executableSchema;
