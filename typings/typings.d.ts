declare var __DEV__: boolean;
declare var __TEST__: boolean;
declare var __SERVER__: boolean;
declare var __CLIENT__: boolean;
declare var __SSR__: boolean;
declare var __PERSIST_GQL__: boolean;
declare var __BACKEND_URL__: string;

declare module '*.graphqls' {
  import { DocumentNode } from 'graphql';

  const value: DocumentNode;
  export = value;
}

declare module '*.graphql' {
  // tslint:disable-next-line
  import { DocumentNode } from "graphql";

  const value: DocumentNode;
  export = value;
}

declare module 'graphql-auth' {
  const withAuth: (scope: any, callback: any) => any;
  export { withAuth };
}

declare module '*.json' {
  const value: any;
  export = value;
}

interface Window {
  __APOLLO_STATE__?: any;
}
