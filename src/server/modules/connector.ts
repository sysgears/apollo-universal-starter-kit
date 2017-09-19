/* eslint-disable no-unused-vars */
import { merge, map, union, without, castArray } from 'lodash';
import { DocumentNode } from "graphql";
import { RequestHandler, Request } from "express";
import { PubSub } from "graphql-subscriptions";
import { IResolvers } from "graphql-tools/dist/Interfaces";

const combine = (features: IArguments, extractor: (x: Feature) => any): Array<any> =>
  without(union(...map(features, res => castArray(extractor(res)))), undefined);

type FeatureParams = {
  schema?: DocumentNode | DocumentNode[];
  createResolversFunc?: Function | Function[];
  createContextFunc?: Function | Function[];
  middleware?: RequestHandler | RequestHandler[];
};

class Feature {
  schema: DocumentNode[];
  createResolversFunc: Function[];
  createContextFunc: Function[];
  middleware: RequestHandler[];

  constructor(
      feature?: FeatureParams,
    ...features: Feature[]
  ) {
    this.schema = combine(arguments, arg => arg.schema);
    this.createResolversFunc = combine(
      arguments,
      arg => arg.createResolversFunc
    );
    this.createContextFunc = combine(arguments, arg => arg.createContextFunc);
    this.middleware = combine(arguments, arg => arg.middleware);
  }

  get schemas(): DocumentNode[] {
    return this.schema;
  }

  async createContext(req: Request, connectionParams?: Object | Function) {
    const results = await Promise.all(
      this.createContextFunc.map(createContext =>
        createContext(req, connectionParams)
      )
    );
    return merge({}, ...results);
  }

  createResolvers(pubsub: PubSub): IResolvers {
    return merge(
      {},
      ...this.createResolversFunc.map(createResolvers =>
        createResolvers(pubsub)
      )
    );
  }

  get middlewares(): RequestHandler[] {
    return this.middleware;
  }
}

export default Feature;