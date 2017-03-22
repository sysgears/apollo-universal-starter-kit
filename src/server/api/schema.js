import { makeExecutableSchema, addErrorLoggingToSchema } from 'graphql-tools'
import { PubSub } from 'graphql-subscriptions'

import log from '../../log'
import schema from './schema_def.graphqls'

export const pubsub = new PubSub();

const resolvers = {
  Query: {
    count(obj, args, context) {
      return context.Count.getCount();
    },
    posts(obj, args, context) {
      return context.Post.getPosts();
    },
  },
  Post: {
    comments({ id }, args, context) {
      return context.loaders.getCommentsForPostIds.load(id);
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

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

addErrorLoggingToSchema(executableSchema, { log: (e) => log.error(e) });

export default executableSchema;
