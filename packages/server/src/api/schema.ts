import { makeExecutableSchema } from 'graphql-tools';

import rootSchemaDef from './rootSchema.graphql';
import modules from '../modules';
import pubsub from './pubsub';

const executableSchema = makeExecutableSchema({
  typeDefs: [rootSchemaDef].concat(modules.schema),
  resolvers: modules.createResolvers(pubsub)
});

export default executableSchema;
