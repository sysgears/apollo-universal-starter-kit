import { Engine } from 'apollo-engine';
import url from 'url';

import Feature from '../connector';
import settings from '../../../../settings';

const { port, pathname } = url.parse(__BACKEND_URL__);
const serverPort = process.env.PORT || port;

const engine = new Engine({
  engineConfig: {
    apiKey: settings.analytics.apolloEngine.key,
    logcfg: {
      level: 'DEBUG' // Engine Proxy logging level. DEBUG, INFO, WARN or ERROR
    }
  },
  graphqlPort: serverPort, // GraphQL port
  endpoint: pathname, // GraphQL endpoint suffix - '/graphql' by default
  dumpTraffic: true // Debug configuration that logs traffic between Proxy and GraphQL server
});

export default new Feature({
  middleware: app => {
    if (settings.analytics.apolloEngine.key) {
      engine.start();

      app.use(engine.expressMiddleware());
    }
  }
});
