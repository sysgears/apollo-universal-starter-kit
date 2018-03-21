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
  resolvers?: any;
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

export default class Feature implements FeatureParams {
  public route: any[];
  public navItem: any[];
  public navItemRight: any[];
  public reducer: any[];
  public resolvers: any[];
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
    combine(arguments, (arg: FeatureParams) => arg.catalogInfo).forEach((info: any) =>
      Object.keys(info).forEach((key: any) => (featureCatalog[key] = info[key]))
    );
    this.route = combine(arguments, (arg: FeatureParams) => arg.route);
    this.navItem = combine(arguments, (arg: FeatureParams) => arg.navItem);
    this.navItemRight = combine(arguments, (arg: FeatureParams) => arg.navItemRight);
    this.reducer = combine(arguments, (arg: FeatureParams) => arg.reducer);
    this.resolvers = combine(arguments, (arg: FeatureParams) => arg.resolvers);
    this.middleware = combine(arguments, (arg: FeatureParams) => arg.middleware);
    this.afterware = combine(arguments, (arg: FeatureParams) => arg.afterware);
    this.connectionParam = combine(arguments, (arg: FeatureParams) => arg.connectionParam);
    this.createFetchOptions = combine(arguments, (arg: FeatureParams) => arg.createFetchOptions);
    this.stylesInsert = combine(arguments, (arg: FeatureParams) => arg.stylesInsert);
    this.scriptsInsert = combine(arguments, (arg: FeatureParams) => arg.scriptsInsert);
    this.rootComponentFactory = combine(arguments, (arg: FeatureParams) => arg.rootComponentFactory);
    this.routerFactory = combine(arguments, (arg: FeatureParams) => arg.routerFactory)
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

  get getResolvers() {
    return merge({}, ...this.resolvers);
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
