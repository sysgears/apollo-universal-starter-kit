// eslint-disable-next-line no-unused-vars
import { createBatchResolver } from 'graphql-resolve-batch';

// eslint-disable-next-line no-unused-vars
export default pubsub => ({
  Query: {
    $module$s: (obj, args, { $Module$ }, info) => {
      return $Module$.getPaginated(args, info);
    },
    $module$: (obj, args, { $Module$ }, info) => {
      return $Module$.get(args, info);
    }
  },
  $Module$Data: {
    // related data
    // end related data
  },
  // schema batch resolvers
  // end schema batch resolvers
  Mutation: {
    create$Module$: (obj, { data }, { $Module$ }, info) => {
      return $Module$.create(data, info);
    },
    update$Module$: (obj, { data, where }, { $Module$ }, info) => {
      return $Module$.update(data, where, info);
    },
    delete$Module$: (obj, { where }, { $Module$ }, info) => {
      return $Module$.delete(where, info);
    },
    sort$Module$s: (obj, { data }, { $Module$ }) => {
      return $Module$.sort(data);
    },
    updateMany$Module$s: (obj, { data, where }, { $Module$ }) => {
      return $Module$.deleteMany(data, where);
    },
    deleteMany$Module$s: (obj, { where }, { $Module$ }) => {
      return $Module$.deleteMany(where);
    }
  },
  Subscription: {}
});
