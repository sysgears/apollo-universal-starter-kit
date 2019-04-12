declare var __SERVER_PORT__: number;
declare var __API_URL__: string;
declare var __FRONTEND_BUILD_DIR__: string;
declare var __DLL_BUILD_DIR__: string;
declare var __SSR__: boolean;

declare namespace NodeJS {
  interface Global {
    WebSocket: any;
    __TEST_SESSION__: any;
  }
}

declare var global: Global;

// packages without types
declare module 'stripe-local';
declare module 'universal-cookie-express';
