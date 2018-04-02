import React from 'react';
import PropTypes from 'prop-types';
import { getOperationAST } from 'graphql';
import { ApolloProvider } from 'react-apollo';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { ApolloLink } from 'apollo-link';
import { createApolloFetch, constructDefaultOptions } from 'apollo-fetch';
import { withClientState } from 'apollo-link-state';
import { WebSocketLink } from 'apollo-link-ws';
import { LoggingLink } from 'apollo-logger';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import url from 'url';
import log from '../../common/log';

import modules from '../../client/src/modules';
import MainScreenNavigator from '../../client/src/app/Routes';
import settings from '../../../settings';

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
    const uri =
      this.props.exp.manifest.bundleUrl && hostname === 'localhost'
        ? `${protocol}//${url.parse(this.props.exp.manifest.bundleUrl).hostname}:${port}${pathname}`
        : __API_URL__;
    log.info(`Connecting to GraphQL backend at: ${uri}`);
    const cache = new InMemoryCache();

    const wsUri = uri.replace(/^http/, 'ws');
    const netLink = ApolloLink.split(
      operation => {
        const operationAST = getOperationAST(operation.query, operation.operationName);
        return !!operationAST && operationAST.operation === 'subscription';
      },
      new WebSocketLink({
        uri: wsUri,
        options: {
          reconnect: true
        }
      }),
      new BatchHttpLink({
        fetch:
          modules.createFetch(uri) ||
          createApolloFetch({
            uri,
            constructOptions: (reqs, options) => ({
              ...constructDefaultOptions(reqs, options),
              credentials: 'include'
            })
          })
      })
    );

    for (const localization of modules.localizations) {
      for (const lang of Object.keys(localization.resources)) {
        modules.i18n.addResourceBundle(lang, localization.ns, localization.resources[lang]);
      }
    }

    let connectionParams = {};
    for (const connectionParam of modules.connectionParams) {
      Object.assign(connectionParams, connectionParam());
    }

    const linkState = withClientState({ ...modules.resolvers, cache });

    const links = [...modules.link, linkState, netLink];

    if (settings.app.logging.apolloLogging) {
      links.unshift(new LoggingLink());
    }

    const client = new ApolloClient({
      link: ApolloLink.from(links),
      cache
    });

    return (
      <Provider store={store}>
        <ApolloProvider client={client}>
          <MainScreenNavigator />
        </ApolloProvider>
      </Provider>
    );
  }
}
