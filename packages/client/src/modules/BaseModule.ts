import React from 'react';
import { merge } from 'lodash';
import { ApolloLink } from 'apollo-link';
import { ConnectionParamsOptions } from 'subscriptions-transport-ws';
import { Resource } from 'i18next';
import { Reducer } from 'redux';
import { IResolvers } from 'graphql-tools';

import Module from './Module';

export interface BaseModuleShape {
  localization?: Array<{ ns: string; resources: Resource }>;
  link?: ApolloLink[];
  createNetLink?: () => ApolloLink;
  connectionParam?: ConnectionParamsOptions[];
  reducer?: Array<{ [key: string]: Reducer }>;
  resolver?: Array<{ defaults: { [key: string]: any }; resolvers: IResolvers }>;
  routerFactory?: () => React.ComponentType;
  rootComponentFactory?: Array<(req: Request) => React.ReactElement<any>>;
  dataRootComponent?: React.ComponentType[];
  data?: { [key: string]: any };
}

interface BaseModule extends BaseModuleShape {}

class BaseModule extends Module {
  constructor(...modules: BaseModuleShape[]) {
    super(...modules);
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

  public getDataRoot(root: React.ReactElement<any>) {
    let nestedRoot = root;
    for (const component of this.dataRootComponent) {
      nestedRoot = React.createElement(component, {}, nestedRoot);
    }
    return nestedRoot;
  }

  public getWrappedRoot(root: React.ReactElement<any>, req?: Request) {
    let nestedRoot = root;
    for (const componentFactory of this.rootComponentFactory) {
      nestedRoot = React.cloneElement(componentFactory(req), {}, nestedRoot);
    }
    return nestedRoot;
  }
}

export default BaseModule;
