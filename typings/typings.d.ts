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

declare module 'passport-facebook-ext' {
  import { StrategyOption } from 'passport-facebook';

  // Since there is no 'scope' variable in the StrategyOption interface
  // we create the extension
  export interface StrategyOptionWithScope extends StrategyOption {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope: string[];

    scopeSeparator?: string;
    enableProof?: boolean;
    profileFields?: string[];
  }
}

interface Window {
  __APOLLO_STATE__?: any;
}
