import { makeExecutableSchema } from 'graphql-tools';

import rootSchemaDef from './rootSchema.graphql';
import plugins from '../plugins';
import pubsub from './pubsub';

const executableSchema = makeExecutableSchema({
  typeDefs: [rootSchemaDef].concat(plugins.schemas),
  resolvers: plugins.createResolvers(pubsub)
});

export default executableSchema;
