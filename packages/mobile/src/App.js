import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import url from 'url';
import log from '../../common/log';

import modules from '../../client/src/modules';
import MainScreenNavigator from '../../client/src/app/Routes';
import createApolloClient from '../../common/createApolloClient';

const store = createStore(
  combineReducers({
    ...modules.reducers
  }),
  {} // initial state
);

const { protocol, pathname, port } = url.parse(__API_URL__);

export default class Main extends React.Component {
  static propTypes = {
    exp: PropTypes.object
  };

  render() {
    const { hostname } = url.parse(__API_URL__);
    const apiUrl =
      this.props.exp.manifest.bundleUrl && hostname === 'localhost'
        ? `${protocol}//${url.parse(this.props.exp.manifest.bundleUrl).hostname}:${port}${pathname}`
        : __API_URL__;

    log.info(`Connecting to GraphQL backend at: ${apiUrl}`);
    const client = createApolloClient({
      apiUrl,
      createNetLink: modules.createNetLink,
      links: modules.link,
      connectionParams: modules.connectionParams,
      clientResolvers: modules.resolvers
    });

    return modules.getWrappedRoot(
      <Provider store={store}>
        <ApolloProvider client={client}>
          <MainScreenNavigator />
        </ApolloProvider>
      </Provider>
    );
  }
}
