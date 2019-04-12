import fs from 'fs';
import path from 'path';
import React from 'react';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import ApolloClient from 'apollo-client';
import { Request, Response } from 'express';
import { StaticRouter } from 'react-router';
import { SchemaLink } from 'apollo-link-schema';
import { ServerStyleSheet } from 'styled-components';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import ClientModule from '@gqlapp/module-client-react';
import { isApiExternal, apiUrl } from '@gqlapp/core-common';
import { createApolloClient, createReduxStore } from '@gqlapp/core-common';
import { DocumentProps, Document } from './template';
import { GraphQLConfig } from '@gqlapp/module-server-ts';

let assetMap: { [key: string]: string };
let clientModules: ClientModule;

if (__SSR__) {
  clientModules = require('../../../../packages/client/src').default;

  if (module.hot) {
    module.hot.accept(['../../../../packages/client/src'], () => {
      clientModules = require('../../../../packages/client/src').default;
    });
  }
}

type TCreateApp = (req: Request, res: Response, graphQLConfig: GraphQLConfig) => any;

const createApp: TCreateApp = async (req, res, { schema, createGraphQLContext }) => {
  const schemaLink = new SchemaLink({ schema, context: await createGraphQLContext(req, res) });
  const { resolvers, createLink, reducers, router } = clientModules;

  const client = createApolloClient({
    createNetLink: !isApiExternal ? () => schemaLink : null,
    clientResolvers: resolvers,
    createLink,
    connectionParams: null,
    apiUrl
  });

  const store = createReduxStore(reducers, {}, client);
  const context: any = {};

  const dataRoot = clientModules.getDataRoot(
    <StaticRouter location={req.url} context={context}>
      {router}
    </StaticRouter>
  );

  const App = clientModules.getWrappedRoot(
    <Provider store={store}>
      <ApolloProvider client={client}>{dataRoot}</ApolloProvider>
    </Provider>,
    req
  );

  return {
    schemaLink,
    context,
    client,
    store,
    App
  };
};

type TRenderApp = (req: Request, res: Response, graphQLConfig: GraphQLConfig) => any;

const redirectOnMovedPage = (res: Response, context: any) => {
  res.writeHead(301, { Location: context.url });
  res.end();
};

const updateAssetMap = () => {
  if (__DEV__ || !assetMap) {
    const filePath = path.join(__FRONTEND_BUILD_DIR__, 'assets.json');
    assetMap = JSON.parse(fs.readFileSync(filePath).toString());
  }
};

const getDocumentProps = (App: any, client: ApolloClient<any>) => {
  const sheet = new ServerStyleSheet();
  const content = renderToString(sheet.collectStyles(App));
  const css = sheet.getStyleElement().map((el, key) => (el ? React.cloneElement(el, { key }) : el));
  const helmet = Helmet.renderStatic();
  const state = { ...client.cache.extract() };

  return {
    clientModules,
    assetMap,
    content,
    helmet,
    state,
    css
  };
};

const renderDocument = (documentProps: DocumentProps) => `
  <!doctype html>\n${renderToStaticMarkup(<Document {...documentProps} />)}
`;

const respondWithDocument = (req: Request, res: Response, App: any, client: ApolloClient<any>) => {
  updateAssetMap();

  if (!res.getHeader('Content-Type')) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
  }

  return res.end(req.method === 'HEAD' ? null : renderDocument(getDocumentProps(App, client)));
};

const renderApp: TRenderApp = async (req, res, graphQLConfig) => {
  const { App, client, context } = await createApp(req, res, graphQLConfig);
  await getDataFromTree(App);

  res.status(!!context.pageNotFound ? 404 : 200);

  return context.url ? redirectOnMovedPage(res, context) : respondWithDocument(req, res, App, client);
  // return context.url ? redirectOnMovedPage(res, context) : res.send('OLOLO');
};

export default renderApp;
