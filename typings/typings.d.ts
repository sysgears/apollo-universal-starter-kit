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
