import Count from './sql';

export { default as schema } from './schema.graphqls';
export { default as createResolvers } from './resolvers';
export { default as subscriptionsSetup } from './subscriptions_setup';

export const createContext = () => ({Count: new Count()});
