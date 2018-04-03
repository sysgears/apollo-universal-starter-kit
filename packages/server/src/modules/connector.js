// @flow
/* eslint-disable no-unused-vars */
import React from 'react';
import type { DocumentNode } from 'graphql';
import type { Middleware, $Request, $Response } from 'express';

import { merge, map, union, without, castArray } from 'lodash';

import log from '../../../common/log';

export const featureCatalog: any = {};

const combine = (features, extractor): any =>
  without(union(...map(features, res => castArray(extractor(res)))), undefined);

type FeatureParams = {
  schema: DocumentNode | DocumentNode[],
  createResolversFunc?: Function | Function[],
  createContextFunc?: Function | Function[],
  beforeware?: Middleware | Middleware[],
  middleware?: Middleware | Middleware[],
  catalogInfo: any | any[]
};

class Feature {
  schema: DocumentNode[];
  createResolversFunc: Function[];
  createContextFunc: Function[];
  beforeware: Function[];
  middleware: Function[];

  constructor(feature?: FeatureParams, ...features: Feature[]) {
    combine(arguments, arg => arg.catalogInfo).forEach(info =>
      Object.keys(info).forEach(key => (featureCatalog[key] = info[key]))
    );
    this.schema = combine(arguments, arg => arg.schema);
    this.createResolversFunc = combine(arguments, arg => arg.createResolversFunc);
    this.createContextFunc = combine(arguments, arg => arg.createContextFunc);
    this.beforeware = combine(arguments, arg => arg.beforeware);
    this.middleware = combine(arguments, arg => arg.middleware);
    this.createFetchOptions = combine(arguments, arg => arg.createFetchOptions);
  }

  get schemas(): DocumentNode[] {
    return this.schema;
  }

  async createContext(req: $Request, res: $Response, connectionParams: any, webSocket: any) {
    let context = {};
    for (const createContextFunc of this.createContextFunc) {
      context = merge(context, await createContextFunc({ req, res, connectionParams, webSocket, context }));
    }
    return context;
  }

  createResolvers(pubsub: any) {
    return merge({}, ...this.createResolversFunc.map(createResolvers => createResolvers(pubsub)));
  }

  get beforewares(): Middleware[] {
    return this.beforeware;
  }

  get middlewares(): Middleware[] {
    return this.middleware;
  }
}

export default Feature;
