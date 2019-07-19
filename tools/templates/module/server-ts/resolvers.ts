export default (pubsub: any) => ({
  Query: {
    $module$s: (parent: any, args: any, ctx: any, info: any) => {
      return ctx.$Module$.findMany(args, info);
    }
  },
  Mutation: {},
  Subscription: {}
});
