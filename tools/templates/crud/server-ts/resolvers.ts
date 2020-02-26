import withAuth from 'graphql-auth';

// @ts-ignore
import { createBatchResolver } from 'graphql-resolve-batch';

const $MODULE$S_SUBSCRIPTION = '$module$s_subscription';

export default (pubsub: any) => ({
  Query: {
    $module$s: withAuth(['editor:view:all'], (parent: any, args: any, ctx: any, info: any) => {
      return ctx.$Module$.getList(args, info);
    }),
    $module$sConnection: withAuth(['editor:view:all'], (parent: any, args: any, ctx: any, info: any) => {
      return ctx.$Module$.getPaginated(args, info);
    }),
    $module$: withAuth(['editor:view'], (parent: any, args: any, ctx: any, info: any) => {
      return ctx.$Module$.get(args, info);
    })
  },
  // schema batch resolvers
  // end schema batch resolvers
  Mutation: {
    create$Module$: withAuth(['editor:create'], async (parent: any, args: any, ctx: any, info: any) => {
      const $module$ = await ctx.$Module$.create(args, ctx, info);

      pubsub.publish($MODULE$S_SUBSCRIPTION, {
        $module$sUpdated: {
          mutation: 'CREATED',
          node: $module$.node
        }
      });

      return $module$;
    }),
    update$Module$: withAuth(['editor:update'], (parent: any, args: any, ctx: any, info: any) => {
      return ctx.$Module$.update(args, ctx, info);
    }),
    delete$Module$: withAuth(['editor:delete'], (parent: any, args: any, ctx: any, info: any) => {
      return ctx.$Module$.delete(args, info);
    }),
    sort$Module$s: withAuth(['editor:update'], (parent: any, args: any, ctx: any) => {
      return ctx.$Module$.sort(args);
    }),
    updateMany$Module$s: withAuth(['editor:update'], (parent: any, args: any, ctx: any) => {
      return ctx.$Module$.updateMany(args);
    }),
    deleteMany$Module$s: withAuth(['editor:delete'], (parent: any, args: any, ctx: any) => {
      return ctx.$Module$.deleteMany(args);
    })
  },
  Subscription: {
    $module$sUpdated: {
      subscribe: () => pubsub.asyncIterator($MODULE$S_SUBSCRIPTION)
    }
  }
});
