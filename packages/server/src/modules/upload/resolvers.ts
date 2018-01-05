/*eslint-disable no-unused-vars*/
import { PubSub } from 'graphql-subscriptions';

export default (pubsub: PubSub) => ({
  Query: {},
  Mutation: {
    uploadFile: (obj: any, { file }: any, context: any) => {
      // console.log(file);
      return true;
    }
  },
  Subscription: {}
});
