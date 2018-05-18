import withAuth from 'graphql-auth';
// eslint-disable-next-line no-unused-vars
import { createBatchResolver } from 'graphql-resolve-batch';

// eslint-disable-next-line no-unused-vars
export default pubsub => ({
  Query: {
    categorys: withAuth(['editor:view:all'], (parent, args, ctx, info) => {
      return ctx.Category.getList(args, info);
    }),
    categorysConnection: withAuth(['editor:view:all'], (parent, args, ctx, info) => {
      return ctx.Category.getPaginated(args, info);
    }),
    category: withAuth(['editor:view'], (parent, args, ctx, info) => {
      return ctx.Category.get(args, info);
    })
  },
  // schema batch resolvers
  Category: {
    products: createBatchResolver((sources, args, ctx, info) => {
      return ctx.Category.getByIds(sources.map(({ id }) => id), 'category', ctx.Product, info);
    })
  },
  // end schema batch resolvers
  Mutation: {
    createCategory: withAuth(['editor:create'], (parent, args, ctx, info) => {
      return ctx.Category.create(args, ctx, info);
    }),
    updateCategory: withAuth(['editor:update'], (parent, args, ctx, info) => {
      return ctx.Category.update(args, ctx, info);
    }),
    deleteCategory: withAuth(['editor:delete'], (parent, args, ctx, info) => {
      return ctx.Category.delete(args, info);
    }),
    sortCategorys: withAuth(['editor:update'], (parent, args, ctx) => {
      return ctx.Category.sort(args);
    }),
    updateManyCategorys: withAuth(['editor:update'], (parent, args, ctx) => {
      return ctx.Category.updateMany(args);
    }),
    deleteManyCategorys: withAuth(['editor:delete'], (parent, args, ctx) => {
      return ctx.Category.deleteMany(args);
    })
  },
  Subscription: {}
});
