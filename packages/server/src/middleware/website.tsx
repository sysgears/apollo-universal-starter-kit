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

let assetMap: { [key: string]: string };

const renderServerSide = async (req: any, res: any) => {
  const clientModules = require('../../../client/src/modules').default;
  const schemaLink = new SchemaLink({ schema, context: await modules.createContext(req, res) });
  const client = createApolloClient({
    apiUrl,
    createNetLink: !isApiExternal ? () => schemaLink : undefined,
    links: clientModules.link,
    clientResolvers: clientModules.resolvers,
    connectionParams: null
  });
  const store = createReduxStore({}, client);
  const context: any = {};
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

  context.pageNotFound === true ? res.status(404) : res.status(200);

  if (context.url) {
    res.writeHead(301, { Location: context.url });
    res.end();
  } else {
    if (__DEV__ || !assetMap) {
      assetMap = JSON.parse(fs.readFileSync(path.join(__FRONTEND_BUILD_DIR__, 'assets.json')).toString());
    }

    const sheet = new ServerStyleSheet();
    const htmlProps = {
      content: ReactDOMServer.renderToString(sheet.collectStyles(App)),
      css: sheet.getStyleElement().map((el, idx) => (el ? React.cloneElement(el, { key: idx }) : el)),
      helmet: Helmet.renderStatic(), // Avoid memory leak while tracking mounted instances
      state: { ...client.cache.extract() },
      assetMap
    };

    res.send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(<Html {...htmlProps} />)}`);
    res.end();
  }
};

export default async (req: any, res: any, next: (e?: Error) => void) => {
  try {
    if (req.path.indexOf('.') < 0 && __SSR__) {
      return await renderServerSide(req, res);
    } else if (!__SSR__ && req.method === 'GET') {
      res.sendFile(path.resolve(__FRONTEND_BUILD_DIR__, 'index.html'));
    } else {
      next();
    }
  } catch (e) {
    next(e);
  }
};
