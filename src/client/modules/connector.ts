import { castArray, map, merge, union, without } from 'lodash';

import log from '../../common/log';

const combine = (features: IArguments, extractor: (x: Feature) => any): any[] =>
  without(union(...map(features, res => castArray(extractor(res)))), undefined);

interface FeatureParams {
  route?: any;
  navItem?: any;
  navItemRight?: any;
  reducer?: any;
  middleware?: any;
  afterware?: any;
  connectionParam?: any;
  createFetchOptions?: any;
}

class Feature {
  public route: any[];
  public navItem: any[];
  public navItemRight: any[];
  public reducer: any[];
  public middleware: any[];
  public afterware: any[];
  public connectionParam: any[];
  public createFetchOptions: any[];

  constructor(feature?: FeatureParams, ...features: Feature[]) {
    /* eslint-enable no-unused-vars */
    this.route = combine(arguments, arg => arg.route);
    this.navItem = combine(arguments, arg => arg.navItem);
    this.navItemRight = combine(arguments, arg => arg.navItemRight);
    this.reducer = combine(arguments, arg => arg.reducer);
    this.middleware = combine(arguments, arg => arg.middleware);
    this.afterware = combine(arguments, arg => arg.afterware);
    this.connectionParam = combine(arguments, arg => arg.connectionParam);
    this.createFetchOptions = combine(arguments, arg => arg.createFetchOptions);
  }

  get routes() {
    return this.route.map((component, idx) => component);
  }

  get navItems() {
    return this.navItem.map((component, idx) => component);
  }

  get navItemsRight() {
    return this.navItemRight.map((component, idx) => component);
  }

  get reducers() {
    return { ...this.reducer };
  }

  get middlewares() {
    return this.middleware;
  }

  get afterwares() {
    return this.afterware;
  }

  get connectionParams() {
    return this.connectionParam;
  }

  get constructFetchOptions() {
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
}

export default Feature;
