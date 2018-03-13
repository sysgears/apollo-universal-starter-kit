import { merge, map, union, without, castArray } from 'lodash';

const combine = (features: any, extractor: any) =>
  without(union(...map(features, res => castArray(extractor(res)))), undefined);

export const featureCatalog = {};

interface FeatureParams {
  tabItem?: any;
  navItem?: any;
  route?: any;
  reducer?: any;
  resolver?: any;
  routerFactory?: any;
  catalogInfo?: any;
}

export default class {
  public tabItem: any[];
  public route: any[];
  public reducer: any[];
  public resolver: any[];
  public routerFactory: any;
  public catalogInfo: any[];
  // eslint-disable-next-line no-unused-vars
  constructor(
    { route, navItem, reducer, resolver, routerFactory, catalogInfo }: FeatureParams,
    ...features: FeatureParams[]
  ) {
    /* eslint-enable no-unused-vars */
    combine(arguments, (arg: any) => arg.catalogInfo).forEach(info =>
      Object.keys(info).forEach(key => (featureCatalog[key] = info[key]))
    );
    this.tabItem = combine(arguments, (arg: any) => arg.tabItem);
    this.reducer = combine(arguments, (arg: any) => arg.reducer);
    this.resolver = combine(arguments, (arg: any) => arg.resolver);
    this.routerFactory = combine(arguments, (arg: any) => arg.routerFactory)
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
