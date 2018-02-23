// eslint-disable-next-line no-unused-vars
import { createBatchResolver } from 'graphql-resolve-batch';

// eslint-disable-next-line no-unused-vars
export default pubsub => ({
  Query: {
    $module$s: (parent, args, ctx, info) => {
      return ctx.$Module$.getList(args, info);
    },
    $module$sConnection: (parent, args, ctx, info) => {
      return ctx.$Module$.getPaginated(args, info);
    },
    $module$: (parent, args, ctx, info) => {
      return ctx.$Module$.get(args, info);
    }
  },
  // schema batch resolvers
  // end schema batch resolvers
  Mutation: {
    create$Module$: (parent, args, ctx, info) => {
      return ctx.$Module$.create(args, ctx, info);
    },
    update$Module$: (parent, args, ctx, info) => {
      return ctx.$Module$.update(args, ctx, info);
    },
    delete$Module$: (parent, args, ctx, info) => {
      return ctx.$Module$.delete(args, info);
    },
    sort$Module$s: (parent, args, ctx) => {
      return ctx.$Module$.sort(args);
    },
    updateMany$Module$s: (parent, args, ctx) => {
      return ctx.$Module$.updateMany(args);
    },
    deleteMany$Module$s: (parent, args, ctx) => {
      return ctx.$Module$.deleteMany(args);
    }
  },
  Subscription: {}
});
