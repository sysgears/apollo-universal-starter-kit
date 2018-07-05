import React from 'react';

import { merge, map, union, without, castArray } from 'lodash';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

export default class {
  /* eslint-disable no-unused-vars */
  constructor(
    {
      link,
      createNetLink,
      connectionParam,
      reducer,
      resolver,
      routerFactory,
      route,
      navItem,
      navItemRight,
      localization,
      rootComponentFactory,
      dataRootComponent,
      stylesInsert,
      scriptsInsert,
      data
    },
    ...features
  ) {
    // Localization
    this.localization = combine(arguments, arg => arg.localization);

    // Connectivity
    this.link = combine(arguments, arg => arg.link);
    this.createNetLink = combine(arguments, arg => arg.createNetLink)
      .slice(-1)
      .pop();
    this.connectionParam = combine(arguments, arg => arg.connectionParam);

    // State management
    this.reducer = combine(arguments, arg => arg.reducer);
    this.resolver = combine(arguments, arg => arg.resolver);

    // Navigation
    this.routerFactory = combine(arguments, arg => arg.routerFactory)
      .slice(-1)
      .pop();
    this.route = combine(arguments, arg => arg.route);
    this.navItem = combine(arguments, arg => arg.navItem);
    this.navItemRight = combine(arguments, arg => arg.navItemRight);

    // UI provider-components
    this.rootComponentFactory = combine(arguments, arg => arg.rootComponentFactory);
    this.dataRootComponent = combine(arguments, arg => arg.dataRootComponent);

    // TODO: Use React Helmet for those. Low level DOM manipulation
    this.stylesInsert = combine(arguments, arg => arg.stylesInsert);
    this.scriptsInsert = combine(arguments, arg => arg.scriptsInsert);

    // Shared modules data
    this.data = combine([{}].concat(Array.from(arguments)), arg => arg.data).reduce(
      (acc, el) => [{ ...acc[0], ...el }],
      [{}]
    );
  }

  get router() {
    return this.routerFactory();
  }

  get routes() {
    return this.route.map((component, idx) => React.cloneElement(component, { key: idx + this.route.length }));
  }

  get navItems() {
    return this.navItem.map((component, idx) =>
      React.cloneElement(component, {
        key: component.key ? component.key : idx + this.navItem.length
      })
    );
  }

  get navItemsRight() {
    return this.navItemRight.map((component, idx) =>
      React.cloneElement(component, {
        key: component.key ? component.key : idx + this.navItem.length
      })
    );
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

  get stylesInserts() {
    return this.stylesInsert;
  }

  get scriptsInserts() {
    return this.scriptsInsert;
  }

  getWrappedRoot(root, req) {
    let nestedRoot = root;
    for (const componentFactory of this.rootComponentFactory) {
      nestedRoot = React.cloneElement(componentFactory(req), {}, nestedRoot);
    }
    return nestedRoot;
  }

  getDataRoot(root) {
    let nestedRoot = root;
    for (const component of this.dataRootComponent) {
      nestedRoot = React.createElement(component, {}, nestedRoot);
    }
    return nestedRoot;
  }
}
