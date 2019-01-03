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

declare module '@module/user-server-ts' {
  const scopes: any;
  const User: any;
  export = { scopes, User };
}

declare module '@module/authentication-client-react' {
  const access: any;
  export = access;
}
