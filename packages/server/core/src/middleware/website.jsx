import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createBatchingNetworkInterface } from 'apollo-client';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { StaticRouter } from 'react-router';
import { ServerStyleSheet } from 'styled-components';
import { addApolloLogging } from 'apollo-logger';
import { addPersistedQueries } from 'persistgraphql';
import fs from 'fs';
import path from 'path';
import Helmet from 'react-helmet';

import createApolloClient from '../../../../common/apollo_client';
import createReduxStore from '../../../../common/redux_store';
import Html from './html';
import routes from '../../../../client/web/src/app/routes';
import log from '../../../../common/log';
import { app as settings } from '../../app.json';

const port = process.env.PORT || settings.apiPort;

const apiUrl = `http://localhost:${port}/graphql`;

let assetMap;

async function renderServerSide(req, res, queryMap) {
  let networkInterface = createBatchingNetworkInterface({
    uri: apiUrl,
    opts: {
      credentials: "same-origin",
      headers: req.headers,
    },
    batchInterval: 20,
  });

  if (__PERSIST_GQL__) {
    networkInterface = addPersistedQueries(networkInterface, queryMap);
  }

  if (settings.apolloLogging) {
    networkInterface = addApolloLogging(networkInterface);
  }

  const client = createApolloClient(networkInterface);

  let initialState = {};
  const store = createReduxStore(initialState, client);

  const context = {};
  const component = (
    <ApolloProvider store={store} client={client}>
      <StaticRouter
        location={req.url}
        context={context}
      >
        {routes}
      </StaticRouter>
    </ApolloProvider>
  );

  await getDataFromTree(component);

  res.status(200);

  const sheet = new ServerStyleSheet();
  const html = ReactDOMServer.renderToString(sheet.collectStyles(component));
  const css = sheet.getStyleElement();
  const helmet = Helmet.renderStatic(); // Avoid memory leak while tracking mounted instances

  if (context.url) {
    res.writeHead(301, { Location: context.url });
    res.end();
  } else {
    if (__DEV__ || !assetMap) {
      assetMap = JSON.parse(fs.readFileSync(path.join(settings.frontendBuildDir, 'assets.json')));
    }

    const apolloState = Object.assign({}, client.store.getState());

    // Temporary workaround for bug in AC@0.5.0: https://github.com/apollostack/apollo-client/issues/845
    delete apolloState.apollo.queries;
    delete apolloState.apollo.mutations;

    const page = <Html content={html} state={apolloState} assetMap={assetMap} css={css} helmet={helmet}/>;
    res.send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(page)}`);
    res.end();
  }
}

async function renderClientSide(req, res) {
  const helmet = Helmet.renderStatic(); // Avoid memory leak while tracking mounted instances
  
  if (__DEV__ || !assetMap) {
    assetMap = JSON.parse(fs.readFileSync(path.join(settings.frontendBuildDir, 'assets.json')));
  }
  const page = <Html state={({})} assetMap={assetMap} helmet={helmet}/>;
  res.send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(page)}`);
  res.end();
}

export default queryMap => async (req, res, next) => {
  try {
    if (req.url.indexOf('.') < 0) {
      if (__SSR__) {
        return renderServerSide(req, res, queryMap);
      } else {
        return renderClientSide(req, res);
      }
    } else {
      return next();
    }
  } catch (e) { log.error('RENDERING ERROR:', e); }
};
