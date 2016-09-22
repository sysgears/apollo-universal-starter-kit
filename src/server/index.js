import express from 'express';
import { graphiqlExpress, apolloExpress } from 'apollo-server'
import bodyParser from 'body-parser'
import fetch from 'isomorphic-fetch' // eslint-disable-line no-unused-vars

import log from '../log'

log('Started Node app....');

// Hot reloadable modules
var websiteMiddleware = require('./middleware/website').default;
var graphqlMiddleware = require('./middleware/graphql').default;

var server;

if (module.hot) {
  module.hot.status(event => {
    if (event === 'abort' || event === 'fail') {
      log('HMR error status: ' + event);
      // Signal run.js to do full-reload of the back-end
      process.exit(250);
    }
  });

  module.hot.dispose(() => {
    if (server) {
      server.close();
    }
  });

  module.hot.accept();

  // Reload reloadable modules
  module.hot.accept('./middleware/website', () => { websiteMiddleware = require('./middleware/website').default; });
  module.hot.accept('./middleware/graphql', () => { graphqlMiddleware = require('./middleware/graphql').default; });
}

process.on('uncaughtException', (ex) => {
  log.error(ex);
  process.exit(1);
});

const app = express();

const port = process.env.PORT || 8080;
// Don't rate limit heroku
app.enable('trust proxy');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/graphql', apolloExpress(graphqlMiddleware));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  query:
    '{\n' +
    '  count {\n' +
    '    amount\n' +
    '  }\n' +
    '}'
}));

app.use('/assets', express.static('build/client', {maxAge: '180 days'}));

app.use((req, res) => websiteMiddleware(req, res));

server = app.listen(port, () => {
  log.info(`Node app is running on port ${port}`);
});

