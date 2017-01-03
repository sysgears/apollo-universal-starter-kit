import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { spawn } from 'child_process'
import waitForPort from 'wait-for-port'
import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import minilog from 'minilog'
import _ from 'lodash'

import configs from './webpack.config'

minilog.enable();

const logBack = minilog('webpack-for-backend');
const logFront = minilog('webpack-for-frontend');

const [ serverConfig, clientConfig ] = configs;
const __WINDOWS__ = /^win/.test(process.platform);

var server;
var startBackend = false;

process.on('exit', () => {
  if (server) {
    server.kill('SIGTERM');
  }
});

function createDirs(dir) {
  mkdirp.sync(dir);
}

function runServer(path) {
  if (startBackend) {
    startBackend = false;
    logBack('Starting backend');
    server = spawn('node', [path]);
    server.stdout.on('data', data => {
      process.stdout.write(data);
    });
    server.stderr.on('data', data => {
      process.stderr.write(data);
    });
    server.on('exit', code => {
      if (code === 250) {
        // App requested full reload
        startBackend = true;
      }
      logBack('Backend has been stopped');
      server = undefined;
      runServer(path);
    });
  }
}

function webpackReporter(log, err, stats) {
  if (err) {
    log(err.stack);
    throw new Error("Build error");
  }
  if (stats) {
    log(stats.toString({
      hash: false,
      version: false,
      timings: true,
      assets: false,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: true,
      errors: true,
      errorDetails: true,
      warnings: true,
      publicPath: false,
      colors: true
    }));

    if (!__DEV__) {
      const dir = log === logFront ?
        process.env.npm_package_app_frontendBuildDir :
        process.env.npm_package_app_backendBuildDir;
      createDirs(dir);
      fs.writeFileSync(path.join(dir, 'stats.json'), JSON.stringify(stats.toJson()));
    }
  }
}

function startClient() {
  try {
    const reporter = (...args) => webpackReporter(logFront, ...args);

    if (__DEV__) {
      clientConfig.entry.bundle.push('webpack/hot/dev-server',
          `webpack-dev-server/client?http://localhost:${process.env.npm_package_app_webpackDevPort}/`);
      clientConfig.plugins.push(new webpack.optimize.OccurenceOrderPlugin(),
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoErrorsPlugin());
      clientConfig.output.path = '/';
      clientConfig.debug = true;
      startWebpackDevServer(clientConfig, reporter);
    } else {
      const compiler = webpack(clientConfig);

      compiler.run(reporter);
    }
  } catch (err) {
    logFront(err.stack);
  }
}

function startServer() {
  try {
    const reporter = (...args) => webpackReporter(logBack, ...args);

    if (__DEV__) {
      if (__WINDOWS__) {
        serverConfig.entry.bundle.push('webpack/hot/poll?1000');
      } else {
        serverConfig.entry.bundle.push('webpack/hot/signal.js');
      }
      serverConfig.plugins.push(new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin());
      serverConfig.debug = true;
    }

    const compiler = webpack(serverConfig);

    if (__DEV__) {
      compiler.watch({}, reporter);

      compiler.plugin('done', () => {
        const { output } = serverConfig;
        startBackend = true;
        if (server) {
          if (!__WINDOWS__) {
            server.kill('SIGUSR2');
          }
        } else {
          runServer(path.join(output.path, output.filename));
        }
      });
    } else {
      compiler.run(reporter);
    }
  } catch (err) {
    logBack(err.stack);
  }
}

function startWebpackDevServer(clientConfig, reporter) {
  let compiler = webpack(clientConfig);

  compiler.plugin('done', stats => {
    const dir = process.env.npm_package_app_frontendBuildDir;
    createDirs(dir);
    const assetsMap = JSON.parse(stats.compilation.assets['assets.json'].source());
    _.each(stats.toJson().assetsByChunkName, (assets, bundle) => {
      const bundleJs = assets.constructor === Array ? assets[0] : assets;
      assetsMap[`${bundle}.js`] = bundleJs;
      if (assets.length > 1) {
        assetsMap[`${bundle}.js.map`] = `${bundleJs}.map`;
      }
    });
    fs.writeFileSync(path.join(dir, 'assets.json'), JSON.stringify(assetsMap));
  });

  waitForPort('localhost', process.env.npm_package_app_apiPort, function(err) {
    if (err) throw new Error(err);

    const app = new WebpackDevServer(compiler, {
      hot: true,
      contentBase: '/assets/',
      publicPath: clientConfig.output.publicPath,
      headers: { 'Access-Control-Allow-Origin': '*' },
      proxy: {
        '*': `http://localhost:${process.env.npm_package_app_apiPort}`
      },
      noInfo: true,
      reporter: ({state, stats}) => {
        if (state) {
          logFront("bundle is now VALID.");
        } else {
          logFront("bundle is now INVALID.");
        }
        reporter(null, stats);
      }
    });

    logFront(`Webpack dev server listening on ${process.env.npm_package_app_webpackDevPort}`);
    app.listen(process.env.npm_package_app_webpackDevPort);
  });
}

startClient();
startServer();