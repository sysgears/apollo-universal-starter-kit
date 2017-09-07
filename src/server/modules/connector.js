import { merge, map, union, without, castArray } from 'lodash';

const combine = (features, extractor) =>
  without(union(...map(features, res => castArray(extractor(res)))), undefined);

export default class {
  // eslint-disable-next-line no-unused-vars
  constructor({schema, createResolversFunc, createContextFunc, middleware}, ...features) {
    this.schema = combine(arguments, arg => arg.schema);
    this.createResolversFunc = combine(arguments, arg => arg.createResolversFunc);
    this.createContextFunc = combine(arguments, arg => arg.createContextFunc);
    this.middleware = combine(arguments, arg => arg.middleware);
  }

  get schemas() {
    return this.schema;
  }

  async createContext(req, connectionParams) {
    const results = await Promise.all(this.createContextFunc.map(createContext => createContext(req, connectionParams)));
    return merge({}, ...results);
  }

  createResolvers(pubsub)  {
    return merge({}, ...this.createResolversFunc.map(createResolvers => createResolvers(pubsub)));
  }

  get middlewares() {
    return this.middleware;
  }
}
