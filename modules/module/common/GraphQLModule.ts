import { merge } from 'lodash';
import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { ConnectionParamsOptions } from 'subscriptions-transport-ws';
import { IResolvers } from 'graphql-tools';

import CommonModule, { CommonModuleShape } from './CommonModule';

export interface GraphQLModuleShape extends CommonModuleShape {
  createLink?: Array<(getApolloClient: () => ApolloClient<any>) => ApolloLink>;
  createNetLink?: (apiUrl: string, getApolloClient: () => ApolloClient<any>) => ApolloLink;
  connectionParam?: ConnectionParamsOptions[];
  resolver?: Array<{ defaults: { [key: string]: any }; resolvers: IResolvers }>;
}

interface GraphQLModule extends GraphQLModuleShape {}

class GraphQLModule extends CommonModule {
  constructor(...modules: GraphQLModuleShape[]) {
    super(...modules);
  }

  get resolvers() {
    return merge({}, ...this.resolver);
  }

  get connectionParams() {
    return this.connectionParam;
  }
}

export default GraphQLModule;
