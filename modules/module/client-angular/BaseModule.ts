import { merge } from 'lodash';
import { ApolloLink } from 'apollo-link';
import { ConnectionParamsOptions } from 'subscriptions-transport-ws';
import { IResolvers } from 'graphql-tools';

import CommonModule, { CommonModuleShape } from '@module/module-common';

export interface BaseModuleShape extends CommonModuleShape {
  link?: ApolloLink[];
  createNetLink?: () => ApolloLink;
  connectionParam?: ConnectionParamsOptions[];
  reducer?: Array<{ [key: string]: any }>;
  resolver?: Array<{ defaults: { [key: string]: any }; resolvers: IResolvers }>;
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
}

export default BaseModule;
