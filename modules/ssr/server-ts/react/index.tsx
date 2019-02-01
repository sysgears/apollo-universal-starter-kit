import fs from 'fs';
import path from 'path';
import React from 'react';
import Helmet from 'react-helmet';
import { GraphQLSchema } from 'graphql';
import { ServerStyleSheet } from 'styled-components';
import { getDataFromTree } from 'react-apollo';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import ServerModule from '@gqlapp/module-server-ts';
import ClientModule from '@gqlapp/module-client-react';
import { DocumentProps, Document } from './template';

let assetMap: { [key: string]: string };
let clientModules: ClientModule;
let assets: any;
let bundle: any;

if (__SSR__) {
  assets = require('../../../../packages/client/build/assets.json');
  require(`../../../../packages/client/build${assets['vendor.js']}`);
  bundle = require(`../../../../packages/client/build${assets['index.js']}`);
  clientModules = require('../../../../packages/client/src').default;

  if (module.hot) {
    module.hot.accept(['../../../../packages/client/src'], () => {
      clientModules = require('../../../../packages/client/src').default;
    });
  }
}

const redirectOnMovedPage = (res: any, context: any) => {
  res.writeHead(301, { Location: context.url });
  res.end();
};

const updateAssetMap = () => {
  if (__DEV__ || !assetMap) {
    const filePath = path.join(__FRONTEND_BUILD_DIR__, 'assets.json');
    assetMap = JSON.parse(fs.readFileSync(filePath).toString());
  }
};

const getDocumentProps = (App: any, client: any) => {
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

const respondWithDocument = (req: any, res: any, App: any, client: any) => {
  updateAssetMap();

  if (!res.getHeader('Content-Type')) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
  }

  res.end(req.method === 'HEAD' ? null : renderDocument(getDocumentProps(App, client)));
};

const renderApp = async (req: any, res: any, schema: GraphQLSchema, modules: ServerModule) => {
  // const { App, client, context } = await createApp(req, res, schema, modules);
  // await getDataFromTree(App);
  // res.status(!!context.pageNotFound ? 404 : 200);

  // return context.url ? redirectOnMovedPage(res, context) : respondWithDocument(req, res, App, client);
  res.end('Developing');
};

export default renderApp;
