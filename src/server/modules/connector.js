// @flow
/* eslint-disable no-unused-vars */
import type { DocumentNode } from 'graphql';
import type { Middleware, $Request } from 'express';

import { merge, map, union, without, castArray } from 'lodash';

const combine = (features, extractor): any =>
  without(union(...map(features, res => castArray(extractor(res)))), undefined);

type FeatureParams = {
  schema: DocumentNode | DocumentNode[],
  createResolversFunc?: Function | Function[],
  createContextFunc?: Function | Function[],
  middlewareUse?: Middleware | Middleware[],
  middlewareGet?: Middleware | Middleware[]
};

class Feature {
  schema: DocumentNode[];
  createResolversFunc: Function[];
  createContextFunc: Function[];
  middlewareUse: Middleware[];
  middlewareGet: Middleware[];

  constructor(feature?: FeatureParams, ...features: Feature[]) {
    // console.log(feature.schema[0] instanceof DocumentNode);
    this.schema = combine(arguments, arg => arg.schema);
    this.createResolversFunc = combine(arguments, arg => arg.createResolversFunc);
    this.createContextFunc = combine(arguments, arg => arg.createContextFunc);
    this.middlewareUse = combine(arguments, arg => arg.middlewareUse);
    this.middlewareGet = combine(arguments, arg => arg.middlewareGet);
  }

  get schemas(): DocumentNode[] {
    return this.schema;
  }

  async createContext(req: $Request, connectionParams: any, webSocket: any) {
    const results = await Promise.all(
      this.createContextFunc.map(createContext => createContext(req, connectionParams, webSocket))
    );
    return merge({}, ...results);
  }

  createResolvers(pubsub: any) {
    return merge({}, ...this.createResolversFunc.map(createResolvers => createResolvers(pubsub)));
  }

  get middlewaresUse(): Middleware[] {
    return this.middlewareUse;
  }

  get middlewaresGet(): Middleware[] {
    return this.middlewareGet;
  }
}

export default Feature;
