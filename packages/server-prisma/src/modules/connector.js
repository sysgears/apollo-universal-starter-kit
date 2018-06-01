import { merge, map, union, without, castArray } from 'lodash';

/* eslint-disable no-unused-vars */

export const featureCatalog = {};

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

class Feature {
  constructor({ schema, createResolversFunc, createContextFunc, beforeware, middleware, catalogInfo }, ...features) {
    combine(arguments, arg => arg.catalogInfo).forEach(info =>
      Object.keys(info).forEach(key => (featureCatalog[key] = info[key]))
    );
    this.schema = combine(arguments, arg => arg.schema);
    this.createResolversFunc = combine(arguments, arg => arg.createResolversFunc);
    this.createContextFunc = combine(arguments, arg => arg.createContextFunc);
    this.beforeware = combine(arguments, arg => arg.beforeware);
    this.middleware = combine(arguments, arg => arg.middleware);
  }

  get schemas() {
    return this.schema;
  }

  async createContext(req, res, connectionParams, webSocket) {
    let context = {};
    for (const createContextFunc of this.createContextFunc) {
      console.log('createContextFunc', createContextFunc, req, res, connectionParams, webSocket, context);
      context = merge(context, await createContextFunc({ req, res, connectionParams, webSocket, context }));
    }
    console.log('context', context);
    return context;
  }

  createResolvers(pubsub) {
    return merge({}, ...this.createResolversFunc.map(createResolvers => createResolvers(pubsub)));
  }

  get beforewares() {
    return this.beforeware;
  }

  get middlewares() {
    return this.middleware;
  }
}

export default Feature;
