import { Engine } from 'apollo-engine';
import url from 'url';

import { apiUrl, serverPort } from '../../net';
import Feature from '../connector';
import settings from '../../../../../settings';

let engine;

if (settings.engine.engineConfig.apiKey) {
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
    endpoint: url.parse(__API_URL__).pathname // GraphQL endpoint suffix - '/graphql' by default
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
