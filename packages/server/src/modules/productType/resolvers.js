import withAuth from 'graphql-auth';
// eslint-disable-next-line no-unused-vars
import { createBatchResolver } from 'graphql-resolve-batch';

// eslint-disable-next-line no-unused-vars
export default pubsub => ({
  Query: {
    productTypes: withAuth(['editor:view:all'], (parent, args, ctx, info) => {
      return ctx.ProductType.getList(args, info);
    }),
    productTypesConnection: withAuth(['editor:view:all'], (parent, args, ctx, info) => {
      return ctx.ProductType.getPaginated(args, info);
    }),
    productType: withAuth(['editor:view'], (parent, args, ctx, info) => {
      return ctx.ProductType.get(args, info);
    })
  },
  // schema batch resolvers
  ProductType: {},
  // end schema batch resolvers
  Mutation: {
    createProductType: withAuth(['editor:create'], (parent, args, ctx, info) => {
      return ctx.ProductType.create(args, ctx, info);
    }),
    updateProductType: withAuth(['editor:update'], (parent, args, ctx, info) => {
      return ctx.ProductType.update(args, ctx, info);
    }),
    deleteProductType: withAuth(['editor:delete'], (parent, args, ctx, info) => {
      return ctx.ProductType.delete(args, info);
    }),
    sortProductTypes: withAuth(['editor:update'], (parent, args, ctx) => {
      return ctx.ProductType.sort(args);
    }),
    updateManyProductTypes: withAuth(['editor:update'], (parent, args, ctx) => {
      return ctx.ProductType.updateMany(args);
    }),
    deleteManyProductTypes: withAuth(['editor:delete'], (parent, args, ctx) => {
      return ctx.ProductType.deleteMany(args);
    })
  },
  Subscription: {}
});
