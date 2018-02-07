// eslint-disable-next-line no-unused-vars
import { createBatchResolver } from 'graphql-resolve-batch';

// eslint-disable-next-line no-unused-vars
export default pubsub => ({
  Query: {
    customers: (parent, args, ctx, info) => {
      return ctx.Customer.getList(args, info);
    },
    customersConnection: (parent, args, ctx, info) => {
      return ctx.Customer.getPaginated(args, info);
    },
    customer: (parent, args, ctx, info) => {
      return ctx.Customer.get(args, info);
    }
  },
  CustomerData: {
    // related data
    // end related data
  },
  // schema batch resolvers
  // end schema batch resolvers
  Mutation: {
    createCustomer: (parent, args, ctx, info) => {
      return ctx.Customer.create(args, ctx, info);
    },
    updateCustomer: (parent, args, ctx, info) => {
      return ctx.Customer.update(args, ctx, info);
    },
    deleteCustomer: (parent, args, ctx, info) => {
      return ctx.Customer.delete(args, info);
    },
    sortCustomers: (parent, args, ctx) => {
      return ctx.Customer.sort(args);
    },
    updateManyCustomers: (parent, args, ctx) => {
      return ctx.Customer.updateMany(args);
    },
    deleteManyCustomers: (parent, args, ctx) => {
      return ctx.Customer.deleteMany(args);
    }
  },
  Subscription: {}
});
