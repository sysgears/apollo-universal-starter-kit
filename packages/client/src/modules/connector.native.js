import React from 'react';

import { merge, map, union, without, castArray } from 'lodash';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

export const featureCatalog = {};

const defaultCreateFetch = () => {};

export default class {
  /* eslint-disable no-unused-vars */
  constructor(
    {
      link,
      createFetch,
      route,
      drawerItem,
      localization,
      reducer,
      resolver,
      routerFactory,
      catalogInfo,
      rootComponentFactory
    },
    ...features
  ) {
    /* eslint-enable no-unused-vars */
    combine(arguments, arg => arg.catalogInfo).forEach(info =>
      Object.keys(info).forEach(key => (featureCatalog[key] = info[key]))
    );
    this.link = combine(arguments, arg => arg.link);
    this.createFetch =
      combine(arguments, arg => arg.createFetch !== defaultCreateFetch && arg.createFetch)
        .slice(-1)
        .pop() || defaultCreateFetch;
    this.drawerItem = combine(arguments, arg => arg.drawerItem);
    this.localization = combine(arguments, arg => arg.localization);
    this.reducer = combine(arguments, arg => arg.reducer);
    this.resolver = combine(arguments, arg => arg.resolver);
    this.rootComponentFactory = combine(arguments, arg => arg.rootComponentFactory);
    this.connectionParam = combine(arguments, arg => arg.connectionParam);
    this.routerFactory = combine(arguments, arg => arg.routerFactory)
      .slice(-1)
      .pop();
  }

  get drawerItems() {
    return merge(...this.drawerItem);
  }

  get localizations() {
    return this.localization;
  }

  get reducers() {
    return merge(...this.reducer);
  }

  get resolvers() {
    return merge(...this.resolver);
  }

  get connectionParams() {
    return this.connectionParam;
  }

  get router() {
    return this.routerFactory();
  }

  getWrappedRoot(root, req) {
    let nestedRoot = root;
    for (const componentFactory of this.rootComponentFactory) {
      nestedRoot = React.cloneElement(componentFactory(req), {}, nestedRoot);
    }
    return nestedRoot;
  }

  getSkippedDrawerItems() {
    const items = this.drawerItems;
    return Object.keys(items).filter(itemName => {
      return items[itemName].skip;
    });
  }
}
