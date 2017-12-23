import { Engine } from 'apollo-engine';
import url from 'url';

import Feature from '../connector';
import settings from '../../../../settings';

let engine;

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

export default new Feature({
  beforeware: app => {
    if (settings.engine.engineConfig.apiKey) {
      app.use(engine.expressMiddleware());
    }
  }
});
