import { makeExecutableSchema, addErrorLoggingToSchema } from 'graphql-tools'

import log from '../../log'
import schema from './schema_def.graphql'

const resolvers = {
  Query: {
    count(ignored1, ignored2, context) {
      return context.Count.getCount();
    },
  },
  Mutation: {
    addCount(_, { amount }, context) {
      return context.Count.addCount(amount)
        .then(() => {
          return context.Count.getCount();
        });
    },
  },
};

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

addErrorLoggingToSchema(executableSchema, { log: (e) => log.error(e) });

export default executableSchema;
