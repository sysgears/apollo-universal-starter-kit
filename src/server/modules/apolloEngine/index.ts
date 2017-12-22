import { Engine } from 'apollo-engine';
import * as url from 'url';

import { settings } from '../../../../settings';
import { Feature } from '../connector';

let engine: any;

if (settings.engine.engineConfig.apiKey) {
  const { protocol, hostname, port, pathname } = url.parse(__BACKEND_URL__);
  const apiUrl = `${protocol}//${hostname}:${process.env.PORT || port}${pathname}`;
  const serverPort = process.env.PORT || port;

  engine = new Engine({
    ...settings.engine,
    origins: [
      {
        backend: {
          url: apiUrl,
          supportsBatch: true
        }
      }
    ],
    graphqlPort: serverPort, // GraphQL port
    endpoint: pathname // GraphQL endpoint suffix - '/graphql' by default
  });

  engine.start();
}

export const apolloEngineModule = new Feature({
  beforeware: (app: any) => {
    if (settings.engine.engineConfig.apiKey) {
      app.use(engine.expressMiddleware());
    }
  }
});
