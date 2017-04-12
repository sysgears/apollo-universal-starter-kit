import { merge } from 'lodash';

const contextCreateFns = [];
export const addContextFactory = createContextFunc => {
  contextCreateFns.push(createContextFunc);
};
export const createContext = () =>
  merge({}, ...contextCreateFns.map(createContext => createContext()));

export const graphQLSchemas = [];
export const addGraphQLSchema = schema => graphQLSchemas.push(schema);

const resolversCreateFns = [];
export const addResolversFactory = createResolverFunc =>
  resolversCreateFns.push(createResolverFunc);
export const createResolvers = pubsub =>
  merge({}, ...resolversCreateFns.map(createResolvers => createResolvers(pubsub)));

export const graphQLSubscriptionSetup = {};
export const addSubscriptionSetup = subscriptionSetup =>
  merge(graphQLSubscriptionSetup, subscriptionSetup);
