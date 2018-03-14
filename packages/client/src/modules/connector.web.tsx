import React, { ReactElement, ReactNode } from 'react';

import { merge, map, union, without, castArray } from 'lodash';

import log from '../../../common/log';

const combine = (features: IArguments, extractor: (x: Feature) => any) =>
  without(union(...map(features, (res: any) => castArray(extractor(res)))), undefined);

export const featureCatalog: any = {};

interface FeatureParams {
  route?: any;
  navItem?: any;
  navItemRight?: any;
  reducer?: any;
  resolver?: any;
  middleware?: any;
  afterware?: any;
  connectionParam?: any;
  createFetchOptions?: any;
  stylesInsert?: any;
  scriptsInsert?: any;
  rootComponentFactory?: any;
  routerFactory?: any;
  catalogInfo?: any;
}

export default class Feature {
  public route: any[];
  public navItem: any[];
  public navItemRight: any[];
  public reducer: any[];
  public resolver: any[];
  public middleware: any[];
  public afterware: any[];
  public connectionParam: any[];
  public createFetchOptions: any[];
  public stylesInsert: any[];
  public scriptsInsert: any[];
  public rootComponentFactory: any[];
  public routerFactory: any;
  public catalogInfo: any[];
  /* eslint-disable no-unused-vars */
  constructor(feature?: FeatureParams, ...features: Feature[]) {
    /* eslint-enable no-unused-vars */
    combine(arguments, (arg: Feature) => arg.catalogInfo).forEach((info: any) =>
      Object.keys(info).forEach((key: any) => (featureCatalog[key] = info[key]))
    );
    this.route = combine(arguments, (arg: Feature) => arg.route);
    this.navItem = combine(arguments, (arg: Feature) => arg.navItem);
    this.navItemRight = combine(arguments, (arg: Feature) => arg.navItemRight);
    this.reducer = combine(arguments, (arg: Feature) => arg.reducer);
    this.resolver = combine(arguments, (arg: Feature) => arg.resolver);
    this.middleware = combine(arguments, (arg: Feature) => arg.middleware);
    this.afterware = combine(arguments, (arg: Feature) => arg.afterware);
    this.connectionParam = combine(arguments, (arg: Feature) => arg.connectionParam);
    this.createFetchOptions = combine(arguments, (arg: Feature) => arg.createFetchOptions);
    this.stylesInsert = combine(arguments, (arg: Feature) => arg.stylesInsert);
    this.scriptsInsert = combine(arguments, (arg: Feature) => arg.scriptsInsert);
    this.rootComponentFactory = combine(arguments, (arg: Feature) => arg.rootComponentFactory);
    this.routerFactory = combine(arguments, (arg: Feature) => arg.routerFactory)
      .slice(-1)
      .pop();
  }

  get router() {
    return this.routerFactory();
  }

  get routes() {
    return this.route.map((component: ReactElement<any>, idx: number) =>
      React.cloneElement(component, { key: idx + this.route.length })
    );
  }

  get navItems() {
    return this.navItem.map((component: ReactElement<any>, idx: number) =>
      React.cloneElement(component, {
        key: component.key ? component.key : idx + this.navItem.length
      })
    );
  }

  get navItemsRight() {
    return this.navItemRight.map((component: ReactElement<any>, idx: number) =>
      React.cloneElement(component, {
        key: component.key ? component.key : idx + this.navItem.length
      })
    );
  }

  get reducers() {
    return merge({}, ...this.reducer);
  }

  get resolvers() {
    return merge({}, ...this.resolver);
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

  get stylesInserts() {
    return this.stylesInsert;
  }

  get scriptsInserts() {
    return this.scriptsInsert;
  }

  public getWrappedRoot(root: ReactNode, req?: any): ReactNode {
    let nestedRoot = root;
    for (const componentFactory of this.rootComponentFactory) {
      nestedRoot = React.cloneElement(componentFactory(req), {}, nestedRoot);
    }
    return nestedRoot;
  }
}
