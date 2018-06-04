import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { SchemaLink } from 'apollo-link-schema';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { ServerStyleSheet } from 'styled-components';
import fs from 'fs';
import path from 'path';
import Helmet from 'react-helmet';

import { isApiExternal, apiUrl } from '../net';
import createApolloClient from '../../../common/createApolloClient';
import createReduxStore from '../../../common/createReduxStore';
import Html from './html';
import Routes from '../../../client/src/app/Routes';
import modules from '../modules';
import schema from '../api/schema';

let assetMap;

const renderServerSide = async (req, res) => {
  const clientModules = require('../../../client/src/modules').default;

  const schemaLink = new SchemaLink({ schema, context: await modules.createContext(req, res) });

  const client = createApolloClient({
    apiUrl,
    createNetLink: !isApiExternal ? () => schemaLink : undefined,
    links: clientModules.link,
    clientResolvers: clientModules.resolvers
  });

  let initialState = {};
  const store = createReduxStore(initialState, client);

  const context = {};
  const App = clientModules.getWrappedRoot(
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

  await getDataFromTree(App);

  if (context.pageNotFound === true) {
    res.status(404);
  } else {
    res.status(200);
  }

  const sheet = new ServerStyleSheet();
  const html = ReactDOMServer.renderToString(sheet.collectStyles(App));
  const css = sheet.getStyleElement().map((el, idx) => (el ? React.cloneElement(el, { key: idx }) : el));
  const helmet = Helmet.renderStatic(); // Avoid memory leak while tracking mounted instances

  if (context.url) {
    res.writeHead(301, { Location: context.url });
    res.end();
  } else {
    if (__DEV__ || !assetMap) {
      assetMap = JSON.parse(fs.readFileSync(path.join(__FRONTEND_BUILD_DIR__, 'assets.json')));
    }

    const apolloState = Object.assign({}, client.cache.extract());

    const page = <Html content={html} state={apolloState} assetMap={assetMap} css={css} helmet={helmet} />;
    res.send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(page)}`);
    res.end();
  }
};

export default async (req, res, next) => {
  try {
    if (req.path.indexOf('.') < 0 && __SSR__) {
      return await renderServerSide(req, res);
    } else {
      next();
    }
  } catch (e) {
    next(e);
  }
};
