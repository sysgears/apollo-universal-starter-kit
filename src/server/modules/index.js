import { merge } from 'lodash';

let req = require.context('.', true, /\.\/[^\/]+\/index$/);
const contextCreateFns = [];
const resolversCreateFns = [];
const subscriptionSetupObjs = [];
const schemaList = [];
req.keys().map(name => {
  const module = req(name);
  if (module.createContext) {
    contextCreateFns.push(module.createContext);
  }
  if (module.schema) {
    schemaList.push(module.schema);
  }
  if (module.createResolvers) {
    resolversCreateFns.push(module.createResolvers);
  }
  if (module.subscriptionSetup) {
    subscriptionSetupObjs.push(module.subscriptionSetup);
  }
});

export const createModulesContext = () =>
  merge({}, ...contextCreateFns.map(createContext => createContext()));

export const getModulesSchema = () => schemaList;

export const createModulesResolvers = pubsub =>
  merge({}, ...resolversCreateFns.map(createResolvers => createResolvers(pubsub)));

export const createModulesSubscriptionSetup = () =>
  merge({}, ...subscriptionSetupObjs);
