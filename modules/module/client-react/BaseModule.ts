import React from 'react';
import { merge } from 'lodash';
import { ApolloLink } from 'apollo-link';
import { ConnectionParamsOptions } from 'subscriptions-transport-ws';
import { Reducer } from 'redux';
import { IResolvers } from 'graphql-tools';

import CommonModule, { CommonModuleShape } from '@module/module-common';

export interface BaseModuleShape extends CommonModuleShape {
  link?: ApolloLink[];
  createNetLink?: () => ApolloLink;
  connectionParam?: ConnectionParamsOptions[];
  reducer?: Array<{ [key: string]: Reducer }>;
  resolver?: Array<{ defaults: { [key: string]: any }; resolvers: IResolvers }>;
  router?: React.ReactElement<any>;
  rootComponentFactory?: Array<(req: Request) => React.ReactElement<any>>;
  dataRootComponent?: React.ComponentType[];
  data?: { [key: string]: any };
}

interface BaseModule extends BaseModuleShape {}

class BaseModule extends CommonModule {
  constructor(...modules: BaseModuleShape[]) {
    super(...modules);
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

  public getDataRoot(root: React.ReactElement<any>) {
    let nestedRoot = root;
    for (const component of this.dataRootComponent || []) {
      nestedRoot = React.createElement(component, {}, nestedRoot);
    }
    return nestedRoot;
  }

  public getWrappedRoot(root: React.ReactElement<any>, req?: Request) {
    let nestedRoot = root;
    for (const componentFactory of this.rootComponentFactory || []) {
      nestedRoot = React.cloneElement(componentFactory(req), {}, nestedRoot);
    }
    return nestedRoot;
  }
}

export default BaseModule;
