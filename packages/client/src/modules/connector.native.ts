import { merge, map, union, without, castArray } from 'lodash';

const combine = (features: IArguments, extractor: (x: Feature) => any) =>
  without(union(...map(features, (res: any) => castArray(extractor(res)))), undefined);

export const featureCatalog: any = {};

interface FeatureParams {
  tabItem?: any;
  navItem?: any;
  route?: any;
  reducer?: any;
  resolver?: any;
  routerFactory?: any;
  catalogInfo?: any;
}

export default class Feature {
  public tabItem: any[];
  public route: any[];
  public reducer: any[];
  public resolver: any[];
  public routerFactory: any;
  public catalogInfo: any[];
  // eslint-disable-next-line no-unused-vars
  constructor(feature?: FeatureParams, ...features: Feature[]) {
    /* eslint-enable no-unused-vars */
    combine(arguments, (arg: Feature) => arg.catalogInfo).forEach((info: any) =>
      Object.keys(info).forEach((key: any) => (featureCatalog[key] = info[key]))
    );
    this.tabItem = combine(arguments, (arg: Feature) => arg.tabItem);
    this.reducer = combine(arguments, (arg: Feature) => arg.reducer);
    this.resolver = combine(arguments, (arg: Feature) => arg.resolver);
    this.routerFactory = combine(arguments, (arg: Feature) => arg.routerFactory)
      .slice(-1)
      .pop();
  }

  get tabItems() {
    return merge({}, ...this.tabItem);
  }

  get reducers() {
    return merge({}, ...this.reducer);
  }

  get resolvers() {
    return merge({}, ...this.resolver);
  }

  get router() {
    return this.routerFactory();
  }
}
