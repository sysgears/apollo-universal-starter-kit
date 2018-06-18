import withAuth from 'graphql-auth';
// eslint-disable-next-line no-unused-vars
import { createBatchResolver } from 'graphql-resolve-batch';

// eslint-disable-next-line no-unused-vars
export default pubsub => ({
  Query: {
    subCategorys: withAuth(['editor:view:all'], (parent, args, ctx, info) => {
      return ctx.SubCategory.getList(args, info);
    }),
    subCategorysConnection: withAuth(['editor:view:all'], (parent, args, ctx, info) => {
      return ctx.SubCategory.getPaginated(args, info);
    }),
    subCategory: withAuth(['editor:view'], (parent, args, ctx, info) => {
      return ctx.SubCategory.get(args, info);
    })
  },
  // schema batch resolvers
  SubCategory: {},
  // end schema batch resolvers
  Mutation: {
    createSubCategory: withAuth(['editor:create'], (parent, args, ctx, info) => {
      return ctx.SubCategory.create(args, ctx, info);
    }),
    updateSubCategory: withAuth(['editor:update'], (parent, args, ctx, info) => {
      return ctx.SubCategory.update(args, ctx, info);
    }),
    deleteSubCategory: withAuth(['editor:delete'], (parent, args, ctx, info) => {
      return ctx.SubCategory.delete(args, info);
    }),
    sortSubCategorys: withAuth(['editor:update'], (parent, args, ctx) => {
      return ctx.SubCategory.sort(args);
    }),
    updateManySubCategorys: withAuth(['editor:update'], (parent, args, ctx) => {
      return ctx.SubCategory.updateMany(args);
    }),
    deleteManySubCategorys: withAuth(['editor:delete'], (parent, args, ctx) => {
      return ctx.SubCategory.deleteMany(args);
    })
  },
  Subscription: {}
});
