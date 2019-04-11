// import fs from 'fs';
// import path from 'path';
import React from 'react';
// import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
// import { GraphQLSchema } from 'graphql';
// import ApolloClient from 'apollo-client';
import { Request, Response } from 'express';
import { StaticRouter } from 'react-router';
import { SchemaLink } from 'apollo-link-schema';
// import { ServerStyleSheet } from 'styled-components';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
// import { renderToString, renderToStaticMarkup } from 'react-dom/server';
// import ServerModule from '@gqlapp/module-server-ts';
import ClientModule from '@gqlapp/module-client-react';
import { isApiExternal, apiUrl } from '@gqlapp/core-common';
import { createApolloClient, createReduxStore } from '@gqlapp/core-common';
// import { DocumentProps, Document } from './template';
import { GraphQLConfig } from '@gqlapp/module-server-ts';

// let assetMap: { [key: string]: string };
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

const createApp: TCreateApp = async (req, res, { schema, createContext }) => {
  const schemaLink = new SchemaLink({
    schema,
    context: { ...(await createContext(req, res)), req, res }
  });

  const { resolvers, createLink, reducers, getWrappedRoot, getDataRoot, router } = clientModules;

  const client = createApolloClient({
    createNetLink: !isApiExternal ? () => schemaLink : null,
    clientResolvers: resolvers,
    createLink,
    connectionParams: null,
    apiUrl
  });

  const store = createReduxStore(reducers, {}, client);
  const context: any = {};

  const dataRoot = getDataRoot(
    <StaticRouter location={req.url} context={context}>
      {router}
    </StaticRouter>
  );

  const App = getWrappedRoot(
    <Provider store={store}>
      <ApolloProvider client={client}>{dataRoot}</ApolloProvider>
    </Provider>,
    req
  );

  // const App = clientModules.getWrappedRoot(
  //   <Provider store={store}>
  //     <ApolloProvider client={client}>
  //       {clientModules.getDataRoot(
  //         <StaticRouter location={req.url} context={context}>
  //           {clientModules.router}
  //         </StaticRouter>
  //       )}
  //     </ApolloProvider>
  //   </Provider>,
  //   req
  // );

  return {
    schemaLink,
    context,
    client,
    store,
    App
  };
};

type TRenderApp = (req: Request, res: Response, graphQLConfig: GraphQLConfig) => any;

const renderApp: TRenderApp = async (req, res, graphQLConfig) => {
  const { App, client, context } = await createApp(req, res, graphQLConfig);
  // await getDataFromTree(App);
  // res.status(!!context.pageNotFound ? 404 : 200);

  // return context.url ? redirectOnMovedPage(res, context) : respondWithDocument(req, res, App, client);
};

export default renderApp;
