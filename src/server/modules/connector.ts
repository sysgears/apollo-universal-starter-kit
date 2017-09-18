/* eslint-disable no-unused-vars */
import { merge, map, union, without, castArray } from 'lodash';
import { GraphQLSchema } from "graphql";
import { RequestHandlerParams } from "express-serve-static-core";
import { PubSub } from "graphql-subscriptions";

const combine = (features: IArguments, extractor: (x: Feature) => any): Array<any> =>
  without(union(...map(features, res => castArray(extractor(res)))), undefined);

type FeatureParams = {
  schema: GraphQLSchema;
  createResolversFunc: Function;
  createContextFunc: Function;
  middleware?: RequestHandlerParams;
};

class Feature {
  schema: GraphQLSchema[];
  createResolversFunc: Function[];
  createContextFunc: Function[];
  middleware: RequestHandlerParams[];

  constructor(
    ...features: (Feature | FeatureParams)[]
  ) {
    this.schema = combine(arguments, arg => arg.schema);
    this.createResolversFunc = combine(
      arguments,
      arg => arg.createResolversFunc
    );
    this.createContextFunc = combine(arguments, arg => arg.createContextFunc);
    this.middleware = combine(arguments, arg => arg.middleware);
  }

  get schemas() {
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

  createResolvers(pubsub: PubSub) {
    return merge(
      {},
      ...this.createResolversFunc.map(createResolvers =>
        createResolvers(pubsub)
      )
    );
  }

  get middlewares() {
    return this.middleware;
  }
}

export default Feature;