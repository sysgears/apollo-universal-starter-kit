import { merge, map, union, without, castArray } from 'lodash';

export interface FeatureShape {
  schema?: any | any[];
  createResolversFunc?: any | any[];
  createContextFunc?: any | any[];
  beforeware?: any | any[];
  middleware?: any | any[];
  localization?: any | any[];
  data?: any | any[];
}

const combine = <F>(features: F[], extractor: (x: F) => any): any[] =>
  without(union(...map(features, res => castArray(extractor(res)))), undefined);

export default class {
  public localization: any[];
  public schema: any[];
  public createResolversFunc: any[];
  public createContextFunc: any[];
  public beforeware: any[];
  public middleware: any[];
  public data: any[];

  constructor(...features: FeatureShape[]) {
    // Localization
    this.localization = combine(features, arg => arg.localization);

    // GraphQL API
    this.schema = combine(features, arg => arg.schema);
    this.createResolversFunc = combine(features, arg => arg.createResolversFunc);
    this.createContextFunc = combine(features, arg => arg.createContextFunc);

    // Middleware
    this.beforeware = combine(features, arg => arg.beforeware);
    this.middleware = combine(features, arg => arg.middleware);

    // Shared modules data
    const empty: FeatureShape = {};
    this.data = combine([empty].concat(Array.from(features)), arg => arg.data).reduce(
      (acc, el) => [{ ...acc[0], ...el }],
      [{}]
    );
  }

  get schemas() {
    return this.schema;
  }

  public async createContext(req: any, res: any, connectionParams: any, webSocket: any) {
    let context = {};
    for (const createContextFunc of this.createContextFunc) {
      context = merge(context, await createContextFunc({ req, res, connectionParams, webSocket, context }));
    }
    return context;
  }

  public createResolvers(pubsub: any) {
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
