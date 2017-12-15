export default {
  engineConfig: {
    apiKey: '', // Set your Engine API key here
    logging: {
      level: 'DEBUG' // Engine Proxy logging level. DEBUG, INFO, WARN or ERROR
    }
  },
  dumpTraffic: true // Debug configuration that logs traffic between Proxy and GraphQL server
};
