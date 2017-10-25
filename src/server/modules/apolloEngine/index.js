import { Engine } from 'apollo-engine';
import url from 'url';

import Feature from '../connector';
import settings from '../../../../settings';

let engine;

if (settings.analytics.apolloEngine.key) {
  const { port, pathname } = url.parse(__BACKEND_URL__);
  const serverPort = process.env.PORT || port;

  engine = new Engine({
    engineConfig: {
      apiKey: settings.analytics.apolloEngine.key,
      logging: {
        level: 'DEBUG' // Engine Proxy logging level. DEBUG, INFO, WARN or ERROR
      }
    },
    graphqlPort: serverPort, // GraphQL port
    endpoint: pathname, // GraphQL endpoint suffix - '/graphql' by default
    dumpTraffic: true // Debug configuration that logs traffic between Proxy and GraphQL server
  });

  engine.start();
}

export default new Feature({
  beforeware: app => {
    if (settings.analytics.apolloEngine.key) {
      app.use(engine.expressMiddleware());
    }
  }
});
