declare let __SERVER_PORT__: number;
declare let __CDN_URL__: string;
declare let __API_URL__: string;
declare let __FRONTEND_BUILD_DIR__: string;
declare let __SSR__: boolean;

declare namespace NodeJS {
  interface Global {
    WebSocket: any;
    __TEST_SESSION__: any;
  }
}

declare let global: Global;

// packages without types
declare module 'stripe-local';
declare module 'universal-cookie-express';
