import ApolloClient from 'apollo-client'

const createApolloClient = networkInterface => {
  const params = {
      dataIdFromObject: (result) => {
        if (result.id && result.__typename) { // eslint-disable-line no-underscore-dangle
          return result.__typename + result.id; // eslint-disable-line no-underscore-dangle
        }
        return null;
      },
      networkInterface,
    };
  if (__SSR__) {
    if (__CLIENT__) {
      if (window.__APOLLO_STATE__) {
        params.initialState = window.__APOLLO_STATE__;
        // Temporary workaround for bug in AC@0.5.0: https://github.com/apollostack/apollo-client/issues/845
        delete params.initialState.apollo.queries;
        delete params.initialState.apollo.mutations;
      }
      params.ssrForceFetchDelay = 100;
    } else {
      params.ssrMode = true;
    }
  }
  return new ApolloClient(params);
};

export default createApolloClient;
