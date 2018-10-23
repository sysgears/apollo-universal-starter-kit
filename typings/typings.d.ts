/// <reference types="mocha" />

declare module '*.graphql' {
  // tslint:disable-next-line
  import { DocumentNode } from "graphql";

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
  var step: Mocha.TestFunction;
  var xstep: Mocha.TestFunction;
}
