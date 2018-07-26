import React from 'react';

import { merge, map, union, without, castArray } from 'lodash';

export interface BaseFeature {
  localization?: any | any[];
  link?: any | any[];
  createNetLink?: any | any[];
  connectionParam?: any | any[];
  reducer?: any | any[];
  resolver?: any | any[];
  routerFactory?: any | any[];
  rootComponentFactory?: any | any[];
  dataRootComponent?: any | any[];
  data?: any | any[];
}

export const combine = <F>(features: F[], extractor: (x: F) => any): any[] =>
  without(union(...map(features, res => castArray(extractor(res)))), undefined);

export default class {
  public localization: any[];
  public link: any[];
  public createNetLink: () => any;
  public connectionParam: any[];
  public reducer: any[];
  public resolver: any[];
  public routerFactory: () => any;
  public rootComponentFactory: any[];
  public dataRootComponent: any[];
  public data: any[];

  constructor(...features: BaseFeature[]) {
    // Localization
    this.localization = combine(features, arg => arg.localization);

    // Connectivity
    this.link = combine(features, arg => arg.link);
    this.createNetLink = combine(features, arg => arg.createNetLink)
      .slice(-1)
      .pop();
    this.connectionParam = combine(features, arg => arg.connectionParam);

    // State management
    this.reducer = combine(features, arg => arg.reducer);
    this.resolver = combine(features, arg => arg.resolver);

    // Navigation
    this.routerFactory = combine(features, arg => arg.routerFactory)
      .slice(-1)
      .pop();

    // UI provider-components
    this.rootComponentFactory = combine(features, arg => arg.rootComponentFactory);
    this.dataRootComponent = combine(features, arg => arg.dataRootComponent);

    // Shared modules data
    const empty: BaseFeature = {};
    this.data = combine([empty].concat(Array.from(features)), arg => arg.data).reduce(
      (acc, el) => [{ ...acc[0], ...el }],
      [{}]
    );
  }

  get localizations() {
    return this.localization;
  }

  get reducers() {
    return merge({}, ...this.reducer);
  }

  get resolvers() {
    return merge({}, ...this.resolver);
  }

  get connectionParams() {
    return this.connectionParam;
  }

  get router() {
    return this.routerFactory();
  }

  public getDataRoot(root: any) {
    let nestedRoot = root;
    for (const component of this.dataRootComponent) {
      nestedRoot = React.createElement(component, {}, nestedRoot);
    }
    return nestedRoot;
  }

  public getWrappedRoot(root: any, req: any) {
    let nestedRoot = root;
    for (const componentFactory of this.rootComponentFactory) {
      nestedRoot = React.cloneElement(componentFactory(req), {}, nestedRoot);
    }
    return nestedRoot;
  }
}
