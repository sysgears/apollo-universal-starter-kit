/* eslint-disable no-unused-vars */
import React from 'react';
import type { DocumentNode } from 'graphql';
import type { Middleware, $Request, $Response } from 'express';

import { merge, map, union, without, castArray } from 'lodash';

export const featureCatalog = {};

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

class Feature {
  constructor(
    { schema, createResolversFunc, createContextFunc, beforeware, middleware, catalogInfo, localization },
    ...features
  ) {
    combine(arguments, arg => arg.catalogInfo).forEach(info =>
      Object.keys(info).forEach(key => (featureCatalog[key] = info[key]))
    );
    this.schema = combine(arguments, arg => arg.schema);
    this.createResolversFunc = combine(arguments, arg => arg.createResolversFunc);
    this.createContextFunc = combine(arguments, arg => arg.createContextFunc);
    this.beforeware = combine(arguments, arg => arg.beforeware);
    this.middleware = combine(arguments, arg => arg.middleware);
    // Localization
    this.localization = combine(arguments, arg => arg.localization);
  }

  get schemas() {
    return this.schema;
  }

  async createContext(req, res, connectionParams, webSocket) {
    let context = {};
    for (const createContextFunc of this.createContextFunc) {
      context = merge(context, await createContextFunc({ req, res, connectionParams, webSocket, context }));
    }
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

  get localizations() {
    return this.localization;
  }
}

export default Feature;
