import { merge, map, union, without, castArray } from 'lodash';

const combine = (features: IArguments, extractor: (x: Feature) => any) =>
  without(union(...map(features, (res: any) => castArray(extractor(res)))), undefined);

export const featureCatalog: any = {};

interface FeatureParams {
  tabItem?: any;
  navItem?: any;
  route?: any;
  reducer?: any;
  clientStateParams?: any;
  routerFactory?: any;
  catalogInfo?: any;
}

export default class Feature implements FeatureParams {
  public tabItem: any[];
  public route: any[];
  public reducer: any[];
  public clientStateParams: any[];
  public routerFactory: any;
  public catalogInfo: any[];
  // eslint-disable-next-line no-unused-vars
  constructor(feature?: FeatureParams, ...features: Feature[]) {
    /* eslint-enable no-unused-vars */
    combine(arguments, (arg: FeatureParams) => arg.catalogInfo).forEach((info: any) =>
      Object.keys(info).forEach((key: any) => (featureCatalog[key] = info[key]))
    );
    this.tabItem = combine(arguments, (arg: FeatureParams) => arg.tabItem);
    this.reducer = combine(arguments, (arg: FeatureParams) => arg.reducer);
    this.clientStateParams = combine(arguments, (arg: FeatureParams) => arg.clientStateParams);
    this.routerFactory = combine(arguments, (arg: FeatureParams) => arg.routerFactory)
      .slice(-1)
      .pop();
  }

  get tabItems() {
    return merge({}, ...this.tabItem);
  }

  get reducers() {
    return merge({}, ...this.reducer);
  }

  get getResolvers() {
    return merge({}, ...this.clientStateParams);
  }

  get router() {
    return this.routerFactory();
  }
}
