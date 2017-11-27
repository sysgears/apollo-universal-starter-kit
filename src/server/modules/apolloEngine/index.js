import { Engine } from 'apollo-engine';
import url from 'url';
import _ from 'lodash';

import Feature from '../connector';
import settings from '../../../../settings';

let engine;

if (settings.engine.enabled && settings.engine.engineConfig.apiKey) {
  const { protocol, hostname, port, pathname } = url.parse(__BACKEND_URL__);
  const apiUrl = `${protocol}//${hostname}:${process.env.PORT || port}${pathname}`;
  const serverPort = process.env.PORT || port;

  engine = new Engine({
    ..._.omit(settings.engine, 'enabled'),
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
    if (settings.engine.enabled && settings.engine.engineConfig.apiKey) {
      app.use(engine.expressMiddleware());
    }
  }
});
