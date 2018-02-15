// eslint-disable-next-line no-unused-vars
import { createBatchResolver } from 'graphql-resolve-batch';

// eslint-disable-next-line no-unused-vars
export default pubsub => ({
  Query: {
    testModules: (parent, args, ctx, info) => {
      return ctx.TestModule.getList(args, info);
    },
    testModulesConnection: (parent, args, ctx, info) => {
      return ctx.TestModule.getPaginated(args, info);
    },
    testModule: (parent, args, ctx, info) => {
      return ctx.TestModule.get(args, info);
    }
  },
  TestModuleData: {
    // related data
    // end related data
  },
  // schema batch resolvers
  // end schema batch resolvers
  Mutation: {
    createTestModule: (parent, args, ctx, info) => {
      return ctx.TestModule.create(args, ctx, info);
    },
    updateTestModule: (parent, args, ctx, info) => {
      return ctx.TestModule.update(args, ctx, info);
    },
    deleteTestModule: (parent, args, ctx, info) => {
      return ctx.TestModule.delete(args, info);
    },
    sortTestModules: (parent, args, ctx) => {
      return ctx.TestModule.sort(args);
    },
    updateManyTestModules: (parent, args, ctx) => {
      return ctx.TestModule.updateMany(args);
    },
    deleteManyTestModules: (parent, args, ctx) => {
      return ctx.TestModule.deleteMany(args);
    }
  },
  Subscription: {}
});
