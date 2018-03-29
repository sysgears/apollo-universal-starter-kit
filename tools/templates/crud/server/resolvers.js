import withAuth from 'graphql-auth';
// eslint-disable-next-line no-unused-vars
import { createBatchResolver } from 'graphql-resolve-batch';

// eslint-disable-next-line no-unused-vars
export default pubsub => ({
  Query: {
    $module$s: withAuth(['editor:view:all'], (parent, args, ctx, info) => {
      return ctx.$Module$.getList(args, info);
    }),
    $module$sConnection: withAuth(['editor:view:all'], (parent, args, ctx, info) => {
      return ctx.$Module$.getPaginated(args, info);
    }),
    $module$: withAuth(['editor:view'], (parent, args, ctx, info) => {
      return ctx.$Module$.get(args, info);
    })
  },
  // schema batch resolvers
  // end schema batch resolvers
  Mutation: {
    create$Module$: withAuth(['editor:create'], (parent, args, ctx, info) => {
      return ctx.$Module$.create(args, ctx, info);
    }),
    update$Module$: withAuth(['editor:update'], (parent, args, ctx, info) => {
      return ctx.$Module$.update(args, ctx, info);
    }),
    delete$Module$: withAuth(['editor:delete'], (parent, args, ctx, info) => {
      return ctx.$Module$.delete(args, info);
    }),
    sort$Module$s: withAuth(['editor:update'], (parent, args, ctx) => {
      return ctx.$Module$.sort(args);
    }),
    updateMany$Module$s: withAuth(['editor:update'], (parent, args, ctx) => {
      return ctx.$Module$.updateMany(args);
    }),
    deleteMany$Module$s: withAuth(['editor:delete'], (parent, args, ctx) => {
      return ctx.$Module$.deleteMany(args);
    })
  },
  Subscription: {}
});
