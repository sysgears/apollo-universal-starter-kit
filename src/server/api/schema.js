import { makeExecutableSchema, addErrorLoggingToSchema } from 'graphql-tools'
import { PubSub } from 'graphql-subscriptions'
import { merge } from 'lodash'

import log from '../../log'

import typeDefs from './graphqls'
import allResolvers from './resolvers'

export const pubsub = new PubSub();

const rootResolvers = {
  Query: {
    count(obj, args, context) {
      return context.Count.getCount();
    },
  },
  Mutation: {
    addCount(obj, { amount }, context) {
      return context.Count.addCount(amount)
        .then(() => context.Count.getCount())
        .then(count => {
          pubsub.publish('countUpdated', count);
          return count;
        });
    },
  },
  Subscription: {
    countUpdated(amount) {
      return amount;
    }
  }
};

const resolvers = merge(rootResolvers, ...allResolvers);

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

addErrorLoggingToSchema(executableSchema, { log: (e) => log.error(e) });

export default executableSchema;
