/* eslint-disable no-unused-vars */
import { GraphQLRequest } from 'apollo-fetch';
import { Request, RequestHandler } from 'express';
import { Application } from 'express';
import { DocumentNode } from 'graphql';
import { castArray, map, merge, union, without } from 'lodash';
import log from '../../../common/log';

const combine = (features: IArguments, extractor: (x: Feature) => any): any[] =>
  without(union(...map(features, res => castArray(extractor(res)))), undefined);

type CreateResolversFunc = (pubsub: any) => any;
type CreateContextFunc = (req: Request, connectionParams?: object | (() => object), webSocket?: any) => object;
type BeforewareFunc = (app: Application) => any;
type MiddlewareFunc = (app: Application) => any;

interface FeatureParams {
  schema?: DocumentNode | DocumentNode[];
  createResolversFunc?: CreateResolversFunc | CreateResolversFunc[];
  createContextFunc?: CreateContextFunc | CreateContextFunc[];
  beforeware?: BeforewareFunc | BeforewareFunc[];
  middleware?: MiddlewareFunc | MiddlewareFunc[];
  createFetchOptions?: any;
  stylesInsert?: any;
}

class Feature {
  public schema: DocumentNode[];
  public createResolversFunc: CreateResolversFunc[];
  public createContextFunc: CreateContextFunc[];
  public beforeware: BeforewareFunc[];
  public middleware: MiddlewareFunc[];
  public createFetchOptions: any[];
  public stylesInsert: any;

  constructor(feature?: FeatureParams, ...features: Feature[]) {
    this.schema = combine(arguments, arg => arg.schema);
    this.createResolversFunc = combine(arguments, arg => arg.createResolversFunc);
    this.createContextFunc = combine(arguments, arg => arg.createContextFunc);
    this.beforeware = combine(arguments, arg => arg.beforeware);
    this.middleware = combine(arguments, arg => arg.middleware);
    this.createFetchOptions = combine(arguments, arg => arg.createFetchOptions);
    this.stylesInsert = combine(arguments, arg => arg.stylesInsert);
  }

  get schemas(): DocumentNode[] {
    return this.schema;
  }

  public async createContext(req: Request, connectionParams?: object | (() => object), webSocket?: any) {
    const results = await Promise.all(
      this.createContextFunc.map(createContext => createContext(req, connectionParams, webSocket))
    );
    return merge({}, ...results);
  }

  public createResolvers(pubsub: any): any {
    return merge({}, ...this.createResolversFunc.map(createResolvers => createResolvers(pubsub)));
  }

  get beforewares(): BeforewareFunc[] {
    return this.beforeware;
  }

  get middlewares(): MiddlewareFunc[] {
    return this.middleware;
  }

  get constructFetchOptions(): any {
    return this.createFetchOptions.length
      ? (...args: any[]) => {
          try {
            let result = {};
            for (const func of this.createFetchOptions) {
              result = { ...result, ...func(...args) };
            }
            return result;
          } catch (e) {
            log.error(e.stack);
          }
        }
      : null;
  }

  get stylesInserts() {
    return this.stylesInsert;
  }
}

export default Feature;
