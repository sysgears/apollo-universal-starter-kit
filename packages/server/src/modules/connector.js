// @flow
/* eslint-disable no-unused-vars */
import type { DocumentNode } from 'graphql';
import type { Middleware, $Request } from 'express';

import { Connector } from 'connector-js';

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
  createFetchOptions?: Function | Function[],
  catalogInfo: any | any[]
};

class Feature extends Connector {
  schema: DocumentNode[];
  createResolversFunc: Function[];
  createContextFunc: Function[];
  createFetchOptions: Function[];
  beforeware: Function[];
  middleware: Function[];

  constructor(feature?: FeatureParams, ...features: Feature[]) {
    super(feature, features);
    // console.log(feature.schema[0] instanceof DocumentNode);
    combine(arguments, arg => arg.catalogInfo).forEach(info =>
      Object.keys(info).forEach(key => (featureCatalog[key] = info[key]))
    );
    /*
    this.schema = combine(arguments, arg => arg.schema);
    this.createResolversFunc = combine(arguments, arg => arg.createResolversFunc);
    this.createContextFunc = combine(arguments, arg => arg.createContextFunc);
    this.beforeware = combine(arguments, arg => arg.beforeware);
    this.middleware = combine(arguments, arg => arg.middleware);
    this.createFetchOptions = combine(arguments, arg => arg.createFetchOptions);
    */
  }

  get schemas(): DocumentNode[] {
    let items = this.Get({ schema: true });
    let docs = combine(items, arg => arg.schema);
    return docs;
  }

  async createContext(req: $Request, connectionParams: any, webSocket: any) {
    let items = this.Get({ createContextFunc: true });
    let fns = combine(items, item => item.createContextFunc);
    const results = await Promise.all(
      fns.map(createContext => createContext(req, connectionParams, webSocket))
    );
    return merge({}, ...results);
  }

  createResolvers(pubsub: any) {
    let items = this.Get({ createResolversFunc: true });
    let fns = combine(items, item => item.createResolversFunc);
    return merge({}, ...fns.map(createResolvers => createResolvers(pubsub)));
  }

  get beforewares(): Middleware[] {
    let items = this.Get({beforeware: true})
    let bs = combine(items, item => item.beforeware)
    return bs;
    // return this.beforeware;
  }

  get middlewares(): Middleware[] {
    let items = this.Get({middleware: true})
    let ms = combine(items, item => item.middleware)
    return ms;
    // return this.middleware;
  }

  get constructFetchOptions(): any {
    let items = this.Get({constructFetchOptions: true})
    let cs = combine(items, item => item.constructFetchOptions)
    return cs.length
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
}

export default Feature;
