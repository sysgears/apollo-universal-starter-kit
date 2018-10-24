declare var __SERVER_PORT__: number;
declare var __API_URL__: string;
declare var __FRONTEND_BUILD_DIR__: string;
declare var __DLL_BUILD_DIR__: string;
declare var __SSR__: boolean;

declare namespace NodeJS {
  interface Global {
    WebSocket: any;
    __TEST_SESSION__: any;
  }
}

declare var global: Global;

// packages without types
declare module 'stripe-local';
declare module 'universal-cookie-express';

// overwrite types
declare module 'graphql-auth' {
  import { Resolver } from './graphql';
  export = withAuth;

  declare function withAuth<R = Resolver>(resolve: R): R;
  declare function withAuth<R = Resolver, P = any, A = any, C = any>(
    scopes:
      | string[]
      | ((
          parent: P,
          args: A,
          context: C,
          info: GraphQLResolveInfo,
        ) => string[]),
    resolver: R,
  ): R;

  declare namespace withAuth {

  }
}
