import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import ApolloClient, { createNetworkInterface, addTypename } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'

import '../ui/styles.scss'
import routes from '../routes'

const client = new ApolloClient({
  networkInterface: createNetworkInterface('/graphql', {
    opts: {
      credentials: 'same-origin',
    },
    transportBatching: true,
  }),
  queryTransformer: addTypename,
  dataIdFromObject: (result) => {
    if (result.id && result.__typename) { // eslint-disable-line no-underscore-dangle
      return result.__typename + result.id; // eslint-disable-line no-underscore-dangle
    }
    return null;
  },
  shouldBatch: true,
  initialState: window.__APOLLO_STATE__, // eslint-disable-line no-underscore-dangle
  ssrForceFetchDelay: 100,
});

render((
  <ApolloProvider client={client}>
    <Router history={browserHistory}>
      {routes}
    </Router>
  </ApolloProvider>
), document.getElementById('content'));
