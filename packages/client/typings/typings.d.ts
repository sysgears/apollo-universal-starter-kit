declare var __DEV__: boolean;
declare var __TEST__: boolean;
declare var __SERVER__: boolean;
declare var __CLIENT__: boolean;
declare var __SSR__: boolean;
declare var __PERSIST_GQL__: boolean;
declare var __API_URL__: string;
declare var __WEBSITE_URL__: string;

declare module 'react-native-web' {
  const val: any;
  export = val;
}

declare module 'react-native-web/dist/apis/AppRegistry/AppContainer' {
  const val: any;
  export = val;
}

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

interface Window {
  __APOLLO_STATE__?: any;
}
