import fs from 'fs';
import path from 'path';
import React from 'react';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import ApolloClient from 'apollo-client';
import { StaticRouter } from 'react-router';
import { SchemaLink } from 'apollo-link-schema';
import { ServerStyleSheet } from 'styled-components';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import ClientModule from '@gqlapp/module-client-react';
import { isApiExternal, apiUrl } from '@gqlapp/core-common';
import { createApolloClient, createReduxStore } from '@gqlapp/core-common';
import { DocumentPropsShape, Document } from './template';
import { GraphQLConfigShape } from '@gqlapp/module-server-ts';

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

interface CreatedAppContextShape {
  url?: any;
  pageNotFound?: any;
}

interface CreatedAppShape {
  schemaLink: SchemaLink;
  context: CreatedAppContextShape;
  client: ApolloClient<any>;
  store: any;
  App: any;
  req: any;
  res: any;
}

type CreateApp = (req: any, res: any, graphQLConfig: GraphQLConfigShape) => Promise<CreatedAppShape>;

const createApp: CreateApp = async (req, res, { schema, createGraphQLContext }) => {
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
  const context: CreatedAppContextShape = {};

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
    App,
    req,
    res
  };
};

type RedirectOnMovedPage = (res: any, context: CreatedAppContextShape) => void;

const redirectOnMovedPage: RedirectOnMovedPage = (res, context) => {
  res.writeHead(301, { Location: context.url });
  res.end();
};

const updateAssetMap = () => {
  if (__DEV__ || !assetMap) {
    const filePath = path.join(__FRONTEND_BUILD_DIR__, 'assets.json');
    assetMap = JSON.parse(fs.readFileSync(filePath).toString());
  }
};

const mapElementToStyles = (el: any, key: number) => (el ? React.cloneElement(el, { key }) : el);

type GetDocumentProps = (App: any, client: ApolloClient<any>) => DocumentPropsShape;

const getDocumentProps: GetDocumentProps = (App, client) => {
  const sheet = new ServerStyleSheet();
  const content = renderToString(sheet.collectStyles(App));
  const css = sheet.getStyleElement().map(mapElementToStyles);
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

type RenderDocument = (documentProps: DocumentPropsShape) => string;

const renderDocument: RenderDocument = documentProps => `
  <!doctype html>\n${renderToStaticMarkup(<Document {...documentProps} />)}
`;

type RespondWithDocument = (req: any, res: any, App: any, client: ApolloClient<any>) => any;

const respondWithDocument: RespondWithDocument = (req, res, App, client) => {
  updateAssetMap();

  if (!res.getHeader('Content-Type')) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
  }

  return res.end(req.method === 'HEAD' ? null : renderDocument(getDocumentProps(App, client)));
};

type SetResponseStatus = (app: CreatedAppShape) => Promise<CreatedAppShape>;

const setResponseStatus: SetResponseStatus = async app => {
  app.res.status(!!app.context.pageNotFound ? 404 : 200);
  return app;
};

type GetDataFromApp = (app: CreatedAppShape) => Promise<CreatedAppShape>;

const getDataFromApp: GetDataFromApp = async app => {
  await getDataFromTree(app.App);
  return app;
};

type RenderApp = (req: any, res: any, graphQLConfig: GraphQLConfigShape) => any;

const renderApp: RenderApp = async (req, res, graphQLConfig) => {
  const { App, client, context } = await setResponseStatus(
    await getDataFromApp(await createApp(req, res, graphQLConfig))
  );

  return context.url ? redirectOnMovedPage(res, context) : respondWithDocument(req, res, App, client);
};

export default renderApp;
