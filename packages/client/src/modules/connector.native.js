import React from 'react';

import { merge, map, union, without, castArray } from 'lodash';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

export const featureCatalog = {};

export default class {
  /* eslint-disable no-unused-vars */
  constructor(
    {
      link,
      createFetch,
      route,
      tabItem,
      internationalization,
      localization,
      drawerFooterItem,
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
    this.createFetch = combine(arguments, arg => arg.createFetch)
      .slice(-1)
      .pop();
    this.tabItem = combine(arguments, arg => arg.tabItem);
    this.internationalization = combine(arguments, arg => arg.internationalization);
    this.localization = combine(arguments, arg => arg.localization);
    this.drawerFooterItem = combine(arguments, arg => arg.drawerFooterItem);
    this.reducer = combine(arguments, arg => arg.reducer);
    this.resolver = combine(arguments, arg => arg.resolver);
    this.rootComponentFactory = combine(arguments, arg => arg.rootComponentFactory);
    this.connectionParam = combine(arguments, arg => arg.connectionParam);
    this.routerFactory = combine(arguments, arg => arg.routerFactory)
      .slice(-1)
      .pop();
  }

  get tabItems() {
    return merge(...this.tabItem);
  }

  get i18n() {
    return merge(...this.internationalization);
  }

  get localizations() {
    return this.localization;
  }

  get drawerFooterItems() {
    return this.drawerFooterItem;
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
    console.warn(this.routerFactory());
    return this.routerFactory();
  }

  getWrappedRoot(root, req) {
    let nestedRoot = root;
    for (const componentFactory of this.rootComponentFactory) {
      nestedRoot = React.cloneElement(componentFactory(req), {}, nestedRoot);
    }
    return nestedRoot;
  }
}
