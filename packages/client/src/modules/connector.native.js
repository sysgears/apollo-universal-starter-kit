import React from 'react';

import { merge, map, union, without, castArray } from 'lodash';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

export default class {
  /* eslint-disable no-unused-vars */
  constructor(
    {
      link,
      createNetLink,
      route,
      drawerItem,
      localization,
      reducer,
      resolver,
      routerFactory,
      rootComponentFactory,
      data
    },
    ...features
  ) {
    /* eslint-enable no-unused-vars */
    this.link = combine(arguments, arg => arg.link);
    this.createNetLink = combine(arguments, arg => arg.createNetLink)
      .slice(-1)
      .pop();
    this.drawerItem = combine(arguments, arg => arg.drawerItem);
    this.localization = combine(arguments, arg => arg.localization);
    this.reducer = combine(arguments, arg => arg.reducer);
    this.resolver = combine(arguments, arg => arg.resolver);
    this.rootComponentFactory = combine(arguments, arg => arg.rootComponentFactory);
    this.connectionParam = combine(arguments, arg => arg.connectionParam);
    this.routerFactory = combine(arguments, arg => arg.routerFactory)
      .slice(-1)
      .pop();

    // Shared modules data
    this.data = combine([{}].concat(Array.from(arguments)), arg => arg.data).reduce(
      (acc, el) => [{ ...acc[0], ...el }],
      [{}]
    );
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
