const createResolver: any = (resolver: any) => {
  const baseResolver = resolver;
  baseResolver.createResolver = (childResolver: any) => {
    const newResolver = async (parent: any, args: any, context: any) => {
      await resolver(parent, args, context);
      return childResolver(parent, args, context);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

export const requiresAuth: any = createResolver((parent: any, args: any, context: any) => {
  if (!context.user || !context.user.id) {
    throw new Error('Not authenticated');
  }
});

export const requiresAdmin: any = requiresAuth.createResolver((parent: any, args: any, context: any) => {
  if (!context.user.isAdmin) {
    throw new Error('Requires admin access');
  }
});
