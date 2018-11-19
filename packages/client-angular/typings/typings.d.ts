declare var __TEST__: boolean;
declare var __SERVER__: boolean;
declare var __CLIENT__: boolean;
declare var __SSR__: boolean;
declare var __API_URL__: string;
declare var __WEBSITE_URL__: string;

interface Window {
  __APOLLO_STATE__?: any;
  __SERVER_ERROR__?: any;
}

// packages without types
declare module 'react-native-credit-card-input';
declare module 'sourcemapped-stacktrace';
