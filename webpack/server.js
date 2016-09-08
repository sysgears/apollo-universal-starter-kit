import dotEnv from 'dotenv'

import WebpackDevServer from 'webpack-dev-server'
import webpack from 'webpack'
import config from './config'
import log from '../src/log'

dotEnv.config();

const webpackPort = 3000;
const appPort = process.env.DEV_APP_PORT;

Object.keys(config.entry)
.forEach((key) => {
  config.entry[key].unshift(`webpack-dev-server/client?http://localhost:${webpackPort}/`)
});

const compiler = webpack(config);
const connString = `http://localhost:${appPort}`;

log.info(`Proxying requests to:${connString}`);

const app = new WebpackDevServer(compiler, {
  contentBase: '/assets/',
  publicPath: '/assets/',
  headers: { 'Access-Control-Allow-Origin': '*' },
  proxy: {
    '*': `http://localhost:${appPort}`
  },
  stats: 'errors-only'
});

app.listen(webpackPort, () => {
  log.info(`Webpack dev server is now running on http://localhost:${webpackPort}`)
});
