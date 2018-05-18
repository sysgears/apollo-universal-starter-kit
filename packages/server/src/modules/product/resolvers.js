import withAuth from 'graphql-auth';
// eslint-disable-next-line no-unused-vars
import { createBatchResolver } from 'graphql-resolve-batch';

// eslint-disable-next-line no-unused-vars
export default pubsub => ({
  Query: {
    products: withAuth(['editor:view:all'], (parent, args, ctx, info) => {
      return ctx.Product.getList(args, info);
    }),
    productsConnection: withAuth(['editor:view:all'], (parent, args, ctx, info) => {
      return ctx.Product.getPaginated(args, info);
    }),
    product: withAuth(['editor:view'], (parent, args, ctx, info) => {
      return ctx.Product.get(args, info);
    })
  },
  // schema batch resolvers
  Product: {},
  // end schema batch resolvers
  Mutation: {
    createProduct: withAuth(['editor:create'], (parent, args, ctx, info) => {
      return ctx.Product.create(args, ctx, info);
    }),
    updateProduct: withAuth(['editor:update'], (parent, args, ctx, info) => {
      return ctx.Product.update(args, ctx, info);
    }),
    deleteProduct: withAuth(['editor:delete'], (parent, args, ctx, info) => {
      return ctx.Product.delete(args, info);
    }),
    sortProducts: withAuth(['editor:update'], (parent, args, ctx) => {
      return ctx.Product.sort(args);
    }),
    updateManyProducts: withAuth(['editor:update'], (parent, args, ctx) => {
      return ctx.Product.updateMany(args);
    }),
    deleteManyProducts: withAuth(['editor:delete'], (parent, args, ctx) => {
      return ctx.Product.deleteMany(args);
    })
  },
  Subscription: {}
});
