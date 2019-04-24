import { merge } from 'lodash';
import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { ConnectionParamsOptions } from 'subscriptions-transport-ws';
import { IResolvers } from 'graphql-tools';

import CommonModule, { CommonModuleShape } from './CommonModule';

/**
 * A function to create non-network Apollo Link that wraps in some way network link.
 * There can be multiple non-network links.
 *
 * @param getApolloClient a function that the link can call later to get instance of Apollo Client
 *
 * @returns Apollo Link instance
 */
type CreateApolloLink = (getApolloClient: () => ApolloClient<any>) => ApolloLink;

/**
 * A function to create Apollo GraphQL link which is used for network communication.
 * The network link can be only one.
 *
 * @param apiUrl the URL to GraphQL server endpoint
 * @param getApolloClient a function that the link can call later to get instance of Apollo Client
 *
 * @returns Apollo Link instance
 */
type CreateNetLink = (apiUrl: string, getApolloClient: () => ApolloClient<any>) => ApolloLink;

/**
 * Apollo Link State default state and client resolvers
 */
interface ApolloLinkStateParams {
  // Default state
  defaults: { [key: string]: any };
  // Client-side resolvers
  resolvers: IResolvers;
}

/**
 * Client-side GraphQL feature module interface.
 */
export interface GraphQLModuleShape extends CommonModuleShape {
  // Array of functions to create non-network Apollo Link
  createLink?: CreateApolloLink[];
  // A singleton to create network link
  createNetLink?: CreateNetLink;
  // `subscription-transport-ws` WebSocket connection options
  connectionParam?: ConnectionParamsOptions[];
  // Apollo Link State default state and client resolvers
  resolver?: ApolloLinkStateParams[];
}

interface GraphQLModule extends GraphQLModuleShape {}

/**
 * Common GraphQL client-side modules ancestor for feature modules of a GraphQL application.
 */
class GraphQLModule extends CommonModule {
  /**
   * Constructs GraphQL feature module representation, that folds all the feature modules
   * into a single module represented by this instance.
   *
   * @param modules feature modules
   */
  constructor(...modules: GraphQLModuleShape[]) {
    super(...modules);
  }

  /**
   * @returns Apollo Link State client-side resolvers
   */
  get resolvers() {
    return merge({}, ...this.resolver);
  }

  /**
   * @returns `subscription-transport-ws` WebSocket connection options
   */
  get connectionParams() {
    return this.connectionParam;
  }
}

export default GraphQLModule;
