// @flow
/* eslint-disable no-unused-vars */
import type { DocumentNode } from 'graphql';
import type { Middleware, $Request } from 'express';

import { merge, map, union, without, castArray } from 'lodash';

import log from '../../common/log';

const combine = (features, extractor): any =>
  without(union(...map(features, res => castArray(extractor(res)))), undefined);

type FeatureParams = {
  schema: DocumentNode | DocumentNode[],
  createResolversFunc?: Function | Function[],
  createContextFunc?: Function | Function[],
  middleware?: Middleware | Middleware[],
  createFetchOptions?: Function | Function[],
  stylesInsert?: any
};

class Feature {
  schema: DocumentNode[];
  createResolversFunc: Function[];
  createContextFunc: Function[];
  createFetchOptions: Function[];
  middleware: Function[];
  stylesInsert: String[];

  constructor(feature?: FeatureParams, ...features: Feature[]) {
    // console.log(feature.schema[0] instanceof DocumentNode);
    this.schema = combine(arguments, arg => arg.schema);
    this.createResolversFunc = combine(arguments, arg => arg.createResolversFunc);
    this.createContextFunc = combine(arguments, arg => arg.createContextFunc);
    this.middleware = combine(arguments, arg => arg.middleware);
    this.createFetchOptions = combine(arguments, arg => arg.createFetchOptions);
    this.stylesInsert = combine(arguments, arg => arg.stylesInsert);
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

  get middlewares(): Middleware[] {
    return this.middleware;
  }

  get constructFetchOptions(): any {
    return this.createFetchOptions.length
      ? (...args) => {
          try {
            let result = {};
            for (let func of this.createFetchOptions) {
              result = { ...result, ...func(...args) };
            }
            return result;
          } catch (e) {
            log.error(e.stack);
          }
        }
      : null;
  }

  get stylesInserts(): any {
    return this.stylesInsert.join('');
  }
}

export default Feature;
