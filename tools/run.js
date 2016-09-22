import webpack from 'webpack';
import path from 'path'
import { spawn } from 'child_process';
import WebpackDevServer from 'webpack-dev-server'
import waitForPort from 'wait-for-port';
import minilog from 'minilog'
import configs from './webpack.config';

minilog.enable();

const logBack = minilog('webpack-for-backend');
const logFront = minilog('webpack-for-frontend');

const [ serverConfig, clientConfig ] = configs;

const appPort = 8080;
const webpackDevPort = 3000;

const isBuild = process.argv.length >= 3 && process.argv[2] === 'build';

var server;
var startBackend = false;

process.on('exit', () => {
  if (server) {
    server.kill('SIGTERM');
  }
});

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
    server.on('close', code => {
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
  }
}

async function startClient() {
  try {
    const reporter = (...args) => webpackReporter(logFront, ...args);

    if (isBuild) {
      const compiler = webpack(clientConfig);

      compiler.run(reporter);
    } else {
      clientConfig.entry.bundle.push('webpack/hot/dev-server',
          `webpack-dev-server/client?http://localhost:${webpackDevPort}/`);
      clientConfig.entry.bundle.unshift('react-hot-loader/patch');
      clientConfig.plugins.push(new webpack.optimize.OccurenceOrderPlugin(),
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoErrorsPlugin());
      clientConfig.output.path = '/';
      clientConfig.debug = true;
      startWebpackDevServer(clientConfig, reporter);
    }
  } catch (err) {
    logFront(err.stack);
  }
}

async function startServer() {
  try {
    const reporter = (...args) => webpackReporter(logBack, ...args);

    if (!isBuild) {
      serverConfig.entry.bundle.push('webpack/hot/signal.js');
      serverConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
      serverConfig.debug = true;
    }

    const compiler = webpack(serverConfig);

    if (isBuild) {
      compiler.run(reporter);
    } else {
      compiler.watch({}, reporter);

      compiler.plugin('done', () => {
        const { output } = serverConfig;
        startBackend = true;
        if (server) {
          server.kill('SIGUSR2');
        } else {
          runServer(path.join(output.path, output.filename));
        }
      });
    }
  } catch (err) {
    logBack(err.stack);
  }
}

function startWebpackDevServer(clientConfig, reporter) {
  let compiler = webpack(clientConfig);

  waitForPort('localhost', appPort, function(err) {
    if (err) throw new Error(err);

    const app = new WebpackDevServer(compiler, {
      hot: true,
      contentBase: '/assets/',
      publicPath: clientConfig.output.publicPath,
      headers: { 'Access-Control-Allow-Origin': '*' },
      proxy: {
        '*': `http://localhost:${appPort}`
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

    logFront(`Webpack dev server listening on ${webpackDevPort}`);
    app.listen(webpackDevPort);
  });
}

startClient();
startServer();