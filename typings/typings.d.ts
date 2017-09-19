declare var __DEV__: boolean;
declare var __TEST__: boolean;
declare var __SERVER__: boolean;
declare var __CLIENT__: boolean;
declare var __SSR__: boolean;
declare var __PERSIST_GQL__: boolean;
declare var __BACKEND_URL__: string;

declare module "*.graphqls" {
    import { DocumentNode } from "graphql";

    const value: DocumentNode;
    export = value;
}

declare module "*.json" {
  const value: any;
  export default value;
}