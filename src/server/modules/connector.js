import { merge, map, union, without, castArray } from 'lodash';

const combine = (features, extractor) =>
  without(union(...map(features, res => castArray(extractor(res)))), undefined);

export default class {
  // eslint-disable-next-line no-unused-vars
  constructor({schema, createResolversFunc, subscriptionsSetup, createContextFunc}, ...features) {
    this.schema = combine(arguments, arg => arg.schema);
    this.createResolversFunc = combine(arguments, arg => arg.createResolversFunc);
    this.subscriptionsSetup = combine(arguments, arg => arg.subscriptionsSetup);
    this.createContextFunc = combine(arguments, arg => arg.createContextFunc);
  }

  get schemas() {
    return this.schema;
  }

  get subscriptionsSetups() {
    return merge(...this.subscriptionsSetup);
  }

  createContext() {
    return merge({}, ...this.createContextFunc.map(createContext => createContext()));
  }

  createResolvers(pubsub)  {
    return merge({}, ...this.createResolversFunc.map(createResolvers => createResolvers(pubsub)));
  }
}
