export default (pubsub: any) => ({
  Query: {
    $module$s: (parent: any, args: any, ctx: any, info: any) => {
      return [{ id: 1, name: 'test' }];
    }
  },
  Mutation: {},
  Subscription: {}
});
