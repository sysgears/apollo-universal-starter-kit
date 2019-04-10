import fs from 'fs';
import path from 'path';
import React from 'react';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import { GraphQLSchema } from 'graphql';
import ApolloClient from 'apollo-client';
import { Request, Response } from 'express';
import { StaticRouter } from 'react-router';
import { SchemaLink } from 'apollo-link-schema';
import { ServerStyleSheet } from 'styled-components';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import ServerModule from '@gqlapp/module-server-ts';
import ClientModule from '@gqlapp/module-client-react';
import { isApiExternal, apiUrl } from '@gqlapp/core-common';
import { createApolloClient, createReduxStore } from '@gqlapp/core-common';
import { DocumentProps, Document } from './template';

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

const createApp = async (req: any, res: any, schema: GraphQLSchema, modules: ServerModule) => {
  const schemaLink = new SchemaLink({
    context: { ...(await modules.createContext(req, res)), req, res },
    schema
  });

  const client = createApolloClient({
    createNetLink: !isApiExternal ? () => schemaLink : undefined,
    clientResolvers: clientModules.resolvers,
    links: clientModules.link,
    connectionParams: null,
    apiUrl
  });

  const store = createReduxStore(clientModules.reducers, {}, client);
  const context: any = {};

  const App = clientModules.getWrappedRoot(
    <Provider store={store}>
      <ApolloProvider client={client}>
        {clientModules.getDataRoot(
          <StaticRouter location={req.url} context={context}>
            {clientModules.router}
          </StaticRouter>
        )}
      </ApolloProvider>
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

const renderApp = async (req: Request, res: Response, schema: GraphQLSchema, modules: ServerModule) => {
  const { App, client, context } = await createApp(req, res, schema, modules);
  await getDataFromTree(App);
  res.status(!!context.pageNotFound ? 404 : 200);

  return context.url ? redirectOnMovedPage(res, context) : respondWithDocument(req, res, App, client);
};

export default renderApp;
