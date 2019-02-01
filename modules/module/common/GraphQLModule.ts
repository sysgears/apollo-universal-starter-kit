import { merge } from 'lodash';
import { ApolloLink } from 'apollo-link';
import { ConnectionParamsOptions } from 'subscriptions-transport-ws';
import { IResolvers } from 'graphql-tools';
import ApolloClient from 'apollo-client';

import CommonModule, { CommonModuleShape } from './CommonModule';

export interface GraphQLModuleShape extends CommonModuleShape {
  createLink?: Array<(getApolloClient: () => ApolloClient<any>) => ApolloLink>;
  createNetLink?: () => ApolloLink;
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
