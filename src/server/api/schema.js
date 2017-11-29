import { makeExecutableSchema } from 'graphql-tools';

import rootSchemaDef from './rootSchema.graphqls';
import modules from '../modules';
import pubsub from './pubsub';

const executableSchema = makeExecutableSchema({
  typeDefs: [rootSchemaDef].concat(modules.schemas),
  resolvers: modules.createResolvers(pubsub)
});

export default executableSchema;
