/*eslint-disable no-unused-vars*/
export default pubsub => ({
  Query: {
    $module$s: (obj, args, { $Module$ }) => {
      return $Module$.get$Module$s();
    }
  },
  Mutation: {},
  Subscription: {}
});
