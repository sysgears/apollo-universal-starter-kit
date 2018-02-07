import React from 'react';

import { Connector } from 'connector-js';

import { merge, map, union, without, castArray } from 'lodash';

import log from '../../../common/log';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

export const featureCatalog = {};

class Feature extends Connector {
  /* eslint-disable no-unused-vars */
  constructor(feature, ...features) {
    super(feature, features);

    let {
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
      catalogInfo
    } = feature;

    /* eslint-enable no-unused-vars */
    combine(arguments, arg => arg.catalogInfo).forEach(info =>
      Object.keys(info).forEach(key => (featureCatalog[key] = info[key]))
    );
    /*
    this.route = combine(arguments, arg => arg.route);
    this.navItem = combine(arguments, arg => arg.navItem);
    this.navItemRight = combine(arguments, arg => arg.navItemRight);
    this.reducer = combine(arguments, arg => arg.reducer);
    this.resolver = combine(arguments, arg => arg.resolver);
    this.middleware = combine(arguments, arg => arg.middleware);
    this.afterware = combine(arguments, arg => arg.afterware);
    this.connectionParam = combine(arguments, arg => arg.connectionParam);
    this.createFetchOptions = combine(arguments, arg => arg.createFetchOptions);
    this.stylesInsert = combine(arguments, arg => arg.stylesInsert);
    this.scriptsInsert = combine(arguments, arg => arg.scriptsInsert);
    this.rootComponentFactory = combine(arguments, arg => arg.rootComponentFactory);
    */
  } // end of constructor

  get routes() {
    let items = this.Get({ route: true });
    let routes = combine(items, item => item.route);
    return routes.map((component, idx) => React.cloneElement(component, { key: idx + routes.length }));
    // return this.route.map((component, idx) => React.cloneElement(component, { key: idx + this.route.length }));
  }

  get navItems() {
    let items = this.Get({navItem: true})
    let navs = combine(items, item => item.navItem)
    return navs.map((component, idx) =>
      React.cloneElement(component, {
        key: component.key ? component.key : idx + navs.length
      })
    );
  }

  get navItemsRight() {
    let items = this.Get({navItemRight: true})
    let navs = combine(items, item => item.navItemRight)
    return navs.map((component, idx) =>
      React.cloneElement(component, {
        key: component.key ? component.key : idx + navs.length
      })
    );
  }

  get reducers() {
    let items = this.Get({reducer: true})
    let rs = combine(items, item => item.reducer)
    return merge(...rs);
  }

  get resolvers() {
    let items = this.Get({resolver: true})
    let rs = combine(items, item => item.resolver)
    return merge(...rs);
  }

  get middlewares() {
    let items = this.Get({middleware: true})
    let ms = combine(items, item => item.middleware)
    return ms;
  }

  get afterwares() {
    let items = this.Get({afterware: true})
    let as = combine(items, item => item.afterware)
    return as;
  }

  get connectionParams() {
    let items = this.Get({connectionParam: true})
    let cs = combine(items, item => item.connectionParam)
    return cs;
  }

  get constructFetchOptions() {
    let items = this.Get({constructFetchOptions: true})
    let cs = combine(items, item => item.constructFetchOptions)
    return cs.length
      ? (...args) => {
          try {
            let result = {};
            for (let func of cs) {
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
    let items = this.Get({stylesInsert: true})
    let is = combine(items, item => item.stylesInsert)
    return is;
  }

  get scriptsInserts() {
    let items = this.Get({scriptsInsert: true})
    let is = combine(items, item => item.scriptsInsert)
    return is;
  }

  getWrappedRoot(root, req) {
    let items = this.Get({rootComponentFactory: true})
    let rf = combine(items, item => item.rootComponentFactory)
    let nestedRoot = root;
    for (const componentFactory of rf) {
      nestedRoot = React.cloneElement(componentFactory(req), {}, nestedRoot);
    }
    return nestedRoot;
  }
}

export default Feature;
