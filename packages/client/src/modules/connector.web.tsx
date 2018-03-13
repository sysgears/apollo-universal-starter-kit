import React from 'react';

import { merge, map, union, without, castArray } from 'lodash';

import log from '../../../common/log';

const combine = (features: any, extractor: any) =>
  without(union(...map(features, (res: any) => castArray(extractor(res)))), undefined);

export const featureCatalog = {};

export default class {
  public route: any;
  public navItem: any;
  public navItemRight: any;
  public reducer: any;
  public resolver: any;
  public middleware: any;
  public afterware: any;
  public connectionParam: any;
  public createFetchOptions: any;
  public stylesInsert: any;
  public scriptsInsert: any;
  public rootComponentFactory: any;
  public routerFactory: any;
  /* eslint-disable no-unused-vars */
  constructor(
    {
      route,
      navItem,
      navItemRight,
      reducer,
      resolver,
      middleware,
      afterware,
      connectionParam,
      createFetchOptions,
      stylesInsert,
      scriptsInsert,
      rootComponentFactory,
      routerFactory,
      catalogInfo
    }: any,
    ...features: any[]
  ) {
    /* eslint-enable no-unused-vars */
    combine(arguments, (arg: any) => arg.catalogInfo).forEach((info: any) =>
      Object.keys(info).forEach(key => (featureCatalog[key] = info[key]))
    );
    this.route = combine(arguments, (arg: any) => arg.route);
    this.navItem = combine(arguments, (arg: any) => arg.navItem);
    this.navItemRight = combine(arguments, (arg: any) => arg.navItemRight);
    this.reducer = combine(arguments, (arg: any) => arg.reducer);
    this.resolver = combine(arguments, (arg: any) => arg.resolver);
    this.middleware = combine(arguments, (arg: any) => arg.middleware);
    this.afterware = combine(arguments, (arg: any) => arg.afterware);
    this.connectionParam = combine(arguments, (arg: any) => arg.connectionParam);
    this.createFetchOptions = combine(arguments, (arg: any) => arg.createFetchOptions);
    this.stylesInsert = combine(arguments, (arg: any) => arg.stylesInsert);
    this.scriptsInsert = combine(arguments, (arg: any) => arg.scriptsInsert);
    this.rootComponentFactory = combine(arguments, (arg: any) => arg.rootComponentFactory);
    this.routerFactory = combine(arguments, (arg: any) => arg.routerFactory)
      .slice(-1)
      .pop();
  }

  get router() {
    return this.routerFactory();
  }

  get routes() {
    return this.route.map((component: any, idx: number) =>
      React.cloneElement(component, { key: idx + this.route.length })
    );
  }

  get navItems() {
    return this.navItem.map((component: any, idx: number) =>
      React.cloneElement(component, {
        key: component.key ? component.key : idx + this.navItem.length
      })
    );
  }

  get navItemsRight() {
    return this.navItemRight.map((component: any, idx: number) =>
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

  public getWrappedRoot(root: any, req?: any): any {
    let nestedRoot = root;
    for (const componentFactory of this.rootComponentFactory) {
      nestedRoot = React.cloneElement(componentFactory(req), {}, nestedRoot);
    }
    return nestedRoot;
  }
}
