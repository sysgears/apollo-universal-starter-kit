import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { SchemaLink } from 'apollo-link-schema';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { createApolloFetch, constructDefaultOptions } from 'apollo-fetch';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { ServerStyleSheet } from 'styled-components';
import { LoggingLink } from 'apollo-logger';
import fs from 'fs';
import path from 'path';
import Helmet from 'react-helmet';
// eslint-disable-next-line
import { AppRegistry } from 'react-native';

import { isApiExternal, apiUrl } from '../net';
import createApolloClient from '../../../common/createApolloClient';
import createReduxStore from '../../../common/createReduxStore';
import Html from './html';
import Routes from '../../../client/src/app/Routes';
import modules from '../modules';
import settings from '../../../../settings';
import schema from '../api/schema';

let assetMap;

const renderServerSide = async (req, res) => {
  const clientModules = require('../../../client/src/modules').default;

  const cache = new InMemoryCache();

  const netLink = !isApiExternal
    ? new SchemaLink({ schema, context: await modules.createContext(req, res) })
    : new BatchHttpLink({
        fetch:
          modules.fetch ||
          createApolloFetch({
            uri: apiUrl,
            constructOptions: (reqs, options) => ({
              ...constructDefaultOptions(reqs, options),
              credentials: 'include'
            })
          })
      });
  const linkState = withClientState({ ...clientModules.resolvers, cache });

  const links = [...clientModules.link, linkState, netLink];

  if (settings.app.logging.apolloLogging) {
    links.unshift(new LoggingLink());
  }

  const client = createApolloClient({
    link: ApolloLink.from(links),
    cache
  });

  let initialState = {};
  const store = createReduxStore(initialState, client);

  const context = {};
  const App = () =>
    clientModules.getWrappedRoot(
      <Provider store={store}>
        <ApolloProvider client={client}>
          {clientModules.getDataRoot(
            <StaticRouter location={req.url} context={context}>
              {Routes}
            </StaticRouter>
          )}
        </ApolloProvider>
      </Provider>,
      req
    );

  AppRegistry.registerComponent('App', () => App);
  const { element, stylesheets } = AppRegistry.getApplication('App', {});

  await getDataFromTree(element);

  if (context.pageNotFound === true) {
    res.status(404);
  } else {
    res.status(200);
  }

  const sheet = new ServerStyleSheet();
  const html = ReactDOMServer.renderToString(sheet.collectStyles(element));
  const css = sheet
    .getStyleElement()
    .concat(stylesheets)
    .map((el, idx) => React.cloneElement(el, { key: idx }));
  const helmet = Helmet.renderStatic(); // Avoid memory leak while tracking mounted instances

  if (context.url) {
    res.writeHead(301, { Location: context.url });
    res.end();
  } else {
    if (__DEV__ || !assetMap) {
      assetMap = JSON.parse(fs.readFileSync(path.join(__FRONTEND_BUILD_DIR__, 'assets.json')));
    }

    const apolloState = Object.assign({}, cache.extract());

    const page = <Html content={html} state={apolloState} assetMap={assetMap} css={css} helmet={helmet} />;
    res.send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(page)}`);
    res.end();
  }
};

export default async (req, res, next) => {
  try {
    if (req.url.indexOf('.') < 0 && __SSR__) {
      return await renderServerSide(req, res);
    } else {
      next();
    }
  } catch (e) {
    next(e);
  }
};
