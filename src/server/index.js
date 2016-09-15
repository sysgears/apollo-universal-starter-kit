import express from 'express';
import React from 'react'
import ReactDOM from 'react-dom/server'
import { apolloExpress, graphiqlExpress } from 'apollo-server'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { getDataFromTree } from 'react-apollo/server'
import bodyParser from 'body-parser'
import { match, RouterContext } from 'react-router';
import { StyleSheetServer } from 'aphrodite'
import fetch from 'isomorphic-fetch' // eslint-disable-line no-unused-vars
import fs from 'fs'

import log from '../log'
import routes from '../routes'
import Html from '../ui/components/html'
import schema from './api/schema'
import Count from './sql/count'

process.on('uncaughtException', (ex) => {
  log.error(ex);
  process.exit(1);
});

const app = express();

// Heroku requires you to use process.env.PORT
const port = process.env.PORT || 8080;
// Don't rate limit heroku
app.enable('trust proxy');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// In development, we use webpack server
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('./build', {
    maxAge: '180 days',
  }));
}

app.use('/graphql', apolloExpress(() => {
  return {
    schema,
    context: {
      Count: new Count(),
    },
  };
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

const apiUrl = `http://localhost:${port}/graphql`;

let assetMap = {
  'bundle.js': 'bundle.js',
  'bundle.css': 'bundle.css'
};

if (process.env.NODE_ENV === 'production') {
  assetMap = JSON.parse(
    fs.readFileSync('./build/assets/assets.json')
  )
}

app.use((req, res) => {
  match({ routes, location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      log.error('ROUTER ERROR:', error);
      res.status(500);
    } else if (renderProps) {
      const client = new ApolloClient({
        ssrMode: true,
        networkInterface: createNetworkInterface(apiUrl, {
          credentials: 'same-origin',
          headers: req.headers,
        }),
      });

      const component = (
        <ApolloProvider client={client}>
          <RouterContext {...renderProps} />
        </ApolloProvider>
      );

      StyleSheetServer.renderStatic(() => getDataFromTree(component).then(context => {
        res.status(200);

        const { html, css } = StyleSheetServer.renderStatic(() => ReactDOM.renderToString(component));

        const page = <Html content={html} state={context.store.getState()} assetMap={assetMap} css={css} />;
        res.send(`<!doctype html>\n${ReactDOM.renderToStaticMarkup(page)}`);
        res.end();
      }).catch(e => log.error('RENDERING ERROR:', e)));
    } else {
      res.status(404).send('Not found');
    }
  });
});

app.listen(port, () => {
  log.info(`Node app is running on port ${port}`);
});
