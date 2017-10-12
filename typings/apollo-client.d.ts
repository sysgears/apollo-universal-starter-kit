declare module 'apollo-client' {
  export { print as printAST } from 'graphql/language/printer';
  export { ObservableQuery, FetchMoreOptions, UpdateQueryOptions } from 'apollo-client/core/ObservableQuery';
  export {
    WatchQueryOptions,
    MutationOptions,
    SubscriptionOptions,
    FetchPolicy,
    FetchMoreQueryOptions,
    SubscribeToMoreOptions,
    MutationUpdaterFn
  } from 'apollo-client/core/watchQueryOptions';
  export { NetworkStatus } from 'apollo-client/core/networkStatus';
  export * from 'apollo-client/core/types';
  export { ApolloError } from 'apollo-client/errors/ApolloError';
  import GenericApolloClient from 'apollo-client/ApolloClient';

  export interface ApolloExecutionResult<
    T = {
      [key: string]: any;
    }
  > {
    data?: T;
  }

  class ApolloClient extends GenericApolloClient<any> {}

  export { ApolloClient };

  export default ApolloClient;
}
