declare var __TEST__: boolean;
declare var __SSR__: boolean;
declare var __SERVER__: boolean;
declare var __SERVER_PORT__: number;
declare var __API_URL__: string;

declare module '*.graphql' {
  import { DocumentNode } from 'graphql';

  const value: DocumentNode;
  export = value;
}

declare module 'minilog';
