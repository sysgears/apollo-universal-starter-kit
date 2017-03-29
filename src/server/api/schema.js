import { makeExecutableSchema, addErrorLoggingToSchema } from 'graphql-tools'
import { PubSub } from 'graphql-subscriptions'
import { merge } from 'lodash';

import log from '../../log'

import { postResolvers } from './resolvers/post_resolvers';

import schema from './graphqls/schema_def.graphqls'
import postSchema from './graphqls/post_def.graphqls'

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

const resolvers = merge(rootResolvers, postResolvers);

const executableSchema = makeExecutableSchema({
  typeDefs: [postSchema, schema],
  resolvers,
});

addErrorLoggingToSchema(executableSchema, { log: (e) => log.error(e) });

export default executableSchema;
