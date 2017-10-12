import Cache from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import Link from 'apollo-link-http';
import * as url from 'url';

const { hostname, pathname, port } = url.parse(__BACKEND_URL__);

const wsUri = (hostname === 'localhost'
  ? `${window.location.protocol}${window.location.hostname}:${port}${pathname}`
  : __BACKEND_URL__
).replace(/^http/, 'ws');

const link = new Link({ uri: wsUri });
const cache = new Cache().restore(window.__APOLLO_STATE__);

// The connection has been established according to the official docs
// (https://github.com/apollographql/apollo-client/blob/master/Upgrade.md)
const client = new ApolloClient({ link, cache });

export let clientProvider = () => {
  return client;
};
