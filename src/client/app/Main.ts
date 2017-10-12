import { Component } from '@angular/core';
import '../styles/styles.scss';

/* ApolloClient initialization */

import Cache from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { createApolloFetch } from 'apollo-fetch';
import { ApolloLink } from 'apollo-link';
import BatchHttpLink from 'apollo-link-batch-http';
import WebSocketLink from 'apollo-link-ws';
import { getOperationAST } from 'graphql';
import * as url from 'url';

const { hostname, pathname, port } = url.parse(__BACKEND_URL__);

const fetch = createApolloFetch({
  uri: hostname === 'localhost' ? '/graphql' : __BACKEND_URL__
});

const wsUri = (hostname === 'localhost'
  ? `${window.location.protocol}${window.location.hostname}:${port}${pathname}`
  : __BACKEND_URL__
).replace(/^http/, 'ws');

const link = ApolloLink.split(
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
  new BatchHttpLink({ fetch })
);

const cache = new Cache().restore(window.__APOLLO_STATE__);

// The connection has been established according to the official docs
// (https://github.com/apollographql/apollo-client/blob/master/Upgrade.md)
const client = new ApolloClient({ link, cache });

export let clientProvider = () => {
  return client;
};

@Component({
  selector: 'body div:first-child',
  template: `<section>
      <nav-bar></nav-bar>
      <counter-view></counter-view>
    </section>`
})
export default class {}
