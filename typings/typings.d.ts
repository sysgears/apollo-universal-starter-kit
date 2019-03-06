/// <reference types="mocha" />

declare module '*.graphql' {
  import { DocumentNode } from 'graphql';

  const value: DocumentNode;
  export = value;
}

declare module '*.json' {
  const value: any;
  export = value;
}

declare module '*.scss' {
  const value: any;
  export = value;
}

declare module 'mocha-steps' {
  const step: Mocha.TestFunction;
  const xstep: Mocha.TestFunction;
}

declare module '@gqlapp/user-server-ts' {
  const scopes: any;
  const User: any;
  export = { scopes, User };
}

declare module '@gqlapp/authentication-client-react' {
  const authentication: any;
  export = authentication;
}
declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
