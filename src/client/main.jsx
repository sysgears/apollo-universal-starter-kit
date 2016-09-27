import React from 'react'
import ApolloClient, { createNetworkInterface, addTypename } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { Router, browserHistory } from 'react-router'
import routes from '../routes'

import '../ui/bootstrap.scss'
import '../ui/styles.scss'

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

export default class Main extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router history={browserHistory} routes={routes}>
        </Router>
      </ApolloProvider>
    );
  }
}
