import express from 'express';
import bodyParser from 'body-parser'
import { app as settings } from '../../package.json'
import websiteMiddleware from './middleware/website'
import graphiqlMiddleware from './middleware/graphiql'
import graphqlMiddleware from './middleware/graphql'

import log from '../log'

log('Started Node app....');

var server;

if (module.hot) {
  module.hot.status(event => {
    if (event === 'abort' || event === 'fail') {
      log('HMR error status: ' + event);
      // Signal webpack.run.js to do full-reload of the back-end
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
  module.hot.accept([
    './middleware/website',
    './middleware/graphql',
    './middleware/graphiql'
  ]);
}

process.on('uncaughtException', (ex) => {
  log.error(ex);
  process.exit(1);
});

const app = express();

const port = process.env.PORT || settings.appPort;
// Don't rate limit heroku
app.enable('trust proxy');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/assets', express.static(settings.frontendBuildDir, {maxAge: '180 days'}));

app.use('/graphql', (...args) => graphqlMiddleware(...args));
app.use('/graphiql', (...args) => graphiqlMiddleware(...args));
app.use((...args) => websiteMiddleware(...args));

server = app.listen(port, () => {
  log.info(`Node app is running on port ${port}`);
});

