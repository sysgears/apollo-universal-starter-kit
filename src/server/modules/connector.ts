/* eslint-disable no-unused-vars */
import { merge, map, union, without, castArray } from 'lodash';
import { GraphQLSchema } from "graphql";
import { RequestHandler } from "express";
import { PubSub } from "graphql-subscriptions";
import {Req} from "awesome-typescript-loader/dist/checker/protocol";

const combine = (features: IArguments, extractor: (x: Feature) => any): Array<any> =>
  without(union(...map(features, res => castArray(extractor(res)))), undefined);

type FeatureParams = {
  schema?: GraphQLSchema | GraphQLSchema[];
  createResolversFunc?: Function | Function[];
  createContextFunc?: Function | Function[];
  middleware?: RequestHandler | RequestHandler[];
};

class Feature {
  schema: GraphQLSchema[];
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

  get schemas(): GraphQLSchema[] {
    return this.schema;
  }

  async createContext(req: Request, connectionParams: Object | Function) {
    const results = await Promise.all(
      this.createContextFunc.map(createContext =>
        createContext(req, connectionParams)
      )
    );
    return merge({}, ...results);
  }

  createResolvers(pubsub: PubSub): Object {
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