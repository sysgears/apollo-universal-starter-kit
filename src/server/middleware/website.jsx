import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { createBatchingNetworkInterface } from 'apollo-client'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import { StaticRouter } from 'react-router'
import { StyleSheetServer, StyleSheetTestUtils } from 'aphrodite'
import fs from 'fs'
import path from 'path'

import createApolloClient from '../../apollo_client'
import createReduxStore from '../../redux_store'
import Html from '../../ui/components/html'
import routes from '../../routes'
import log from '../../log'
import { app as settings } from '../../../package.json'

const port = process.env.PORT || settings.apiPort;

const apiUrl = `http://localhost:${port}/graphql`;

var assetMap;

export default (req, res) => {
  if (__SSR__) {
    const client = createApolloClient(createBatchingNetworkInterface({
      uri: apiUrl,
      opts: {
        credentials: "same-origin",
        headers: req.headers,
      },
      batchInterval: 20,
    }));

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

    // Ignore CSS rendering during extraction of GraphQL queries
    StyleSheetTestUtils.suppressStyleInjection();
    getDataFromTree(component).then(() => {
      StyleSheetTestUtils.clearBufferAndResumeStyleInjection();

      res.status(200);

      const { html, css } = StyleSheetServer.renderStatic(() => ReactDOMServer.renderToString(component));

      if (context.url) {
        res.writeHead(301, { Location: context.url });
        res.end()
      } else {
        if (__DEV__ || !assetMap) {
          assetMap = JSON.parse(fs.readFileSync(path.join(settings.frontendBuildDir, 'assets.json')));
        }

        const apolloState = Object.assign({}, client.store.getState());

        // // Temporary workaround for bug in AC@0.5.0: https://github.com/apollostack/apollo-client/issues/845
        delete apolloState.apollo.queries;
        delete apolloState.apollo.mutations;

        const page = <Html content={html} state={apolloState} assetMap={assetMap} aphroditeCss={css.content}/>;
        res.send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(page)}`);
        res.end();
      }
    }).catch(e => log.error('RENDERING ERROR:', e));
  } else {
     if(__DEV__ || !assetMap) {
       assetMap = JSON.parse(fs.readFileSync(path.join(settings.frontendBuildDir, 'assets.json')));
     }
     const page = <Html content="" state={({})} assetMap={assetMap} aphroditeCss=""/>;
     res.send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(page)}`);
     res.end();
   }
};