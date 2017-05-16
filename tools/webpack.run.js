import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import minilog from 'minilog';
import _ from 'lodash';
import crypto from 'crypto';
import VirtualModules from 'webpack-virtual-modules';
import waitOn from 'wait-on';

import pkg from '../package.json';
import configs from './webpack.config';
import createMobileEntry from './webpack.mobile';

minilog.enable();

const logBack = minilog('webpack-for-backend');

const [serverConfig, clientConfig, dllConfig, androidConfig, iOSConfig] = configs;
const __WINDOWS__ = /^win/.test(process.platform);

let server;
let startBackend = false;
let backendFirstStart = true;

process.on('exit', () => {
  if (server) {
    server.kill('SIGTERM');
  }
});

function runServer(path) {
  if (startBackend) {
    startBackend = false;
    backendFirstStart = false;
    logBack('Starting backend');
    server = spawn('node', [path], { stdio: [0, 1, 2] });
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

function webpackReporter(outputPath, log, err, stats) {
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
      mkdirp.sync(outputPath);
      fs.writeFileSync(path.join(outputPath, 'stats.json'), JSON.stringify(stats.toJson()));
    }
  }
}

var frontendVirtualModules = new VirtualModules({ 'node_modules/backend_reload.js': '' });

function startClient(config) {
  const logger = minilog(`webpack-for-${config.name}`);
  try {
    const reporter = (...args) => webpackReporter(config.output.path, logger, ...args);

    config.plugins.push(frontendVirtualModules);

    if (__DEV__) {
      if (pkg.app.reactHotLoader) {
        config.entry[Object.keys(config.entry)[0]].unshift('react-hot-loader/patch');
      }
      config.entry[Object.keys(config.entry)[0]].unshift(
        `webpack-dev-server/client?http://localhost:${clientConfig.devServer.port}/`,
        'webpack/hot/dev-server');
      config.plugins.push(new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin());
      startWebpackDevServer(config, reporter, logger);
    } else {
      const compiler = webpack(config);

      compiler.run(reporter);
    }
  } catch (err) {
    logger(err.message, err.stack);
  }
}


let backendReloadCount = 0;
function increaseBackendReloadCount() {
  backendReloadCount++;
  frontendVirtualModules.writeModule('node_modules/backend_reload.js',
    `var count = ${backendReloadCount};\n`);
}

function startServer() {
  try {
    const reporter = (...args) => webpackReporter(serverConfig.output.path, logBack, ...args);

    if (__DEV__) {
      if (__WINDOWS__) {
        serverConfig.entry.index.push('webpack/hot/poll?1000');
      } else {
        serverConfig.entry.index.push('webpack/hot/signal.js');
      }
      serverConfig.plugins.push(new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin());
    }

    const compiler = webpack(serverConfig);

    if (__DEV__) {
      compiler.plugin('compilation', compilation => {
        compilation.plugin('after-optimize-assets', assets => {
          // Patch webpack-generated original source files path, by stripping hash after filename
          const mapKey = _.findKey(assets, (v, k) => k.endsWith('.map'));
          if (mapKey) {
            var srcMap = JSON.parse(assets[mapKey]._value);
            for (var idx in srcMap.sources) {
              srcMap.sources[idx] = srcMap.sources[idx].split(';')[0];
            }
            assets[mapKey]._value = JSON.stringify(srcMap);
          }
        });
      });

      compiler.watch({}, reporter);

      compiler.plugin('done', stats => {
        const { output } = serverConfig;
        startBackend = true;
        if (server) {
          if (!__WINDOWS__) {
            server.kill('SIGUSR2');
          }

          if (pkg.app.frontendRefreshOnBackendChange) {
            for (let module of stats.compilation.modules) {
              if (module.built && module.resource &&
                module.resource.indexOf(path.resolve('./src/server')) === 0) {
                // Force front-end refresh on back-end change
                logBack.debug('Force front-end current page refresh, due to change in backend at:', module.resource);
                increaseBackendReloadCount();
                break;
              }
            }
          }
        } else {
          runServer(path.join(output.path, 'index.js'));
        }
      });
    } else {
      compiler.run(reporter);
    }
  } catch (err) {
    logBack(err.message, err.stack);
  }
}

function startWebpackDevServer(config, reporter, logger) {
  const configOutputPath = config.output.path;
  config.output.path = '/';

  config.plugins.push(frontendVirtualModules);

  let compiler = webpack(config);

  compiler.plugin('after-emit', (compilation, callback) => {
    if (backendFirstStart) {
      logger.debug("Webpack dev server is waiting for backend to start...");
      waitOn({ resources: [`tcp:localhost:${pkg.app.apiPort}`] }, err => {
        if (err) {
          logger.error(err);
        } else {
          logger.debug("Backend has been started, resuming webpack dev server...");
          callback();
        }
      });
    } else {
      callback();
    }
  });
  compiler.plugin('done', stats => {
    const dir = configOutputPath;
    mkdirp.sync(dir);
    if (stats.compilation.assets['assets.json']) {
      const assetsMap = JSON.parse(stats.compilation.assets['assets.json'].source());
      _.each(stats.toJson().assetsByChunkName, (assets, bundle) => {
        const bundleJs = assets.constructor === Array ? assets[0] : assets;
        assetsMap[`${bundle}.js`] = bundleJs;
        if (assets.length > 1) {
          assetsMap[`${bundle}.js.map`] = `${bundleJs}.map`;
        }
      });
      if (pkg.app.webpackDll) {
        let json = JSON.parse(fs.readFileSync(path.join(pkg.app.frontendBuildDir, 'vendor_dll_hashes.json')));
        assetsMap['vendor.js'] = json.name;
      }
      fs.writeFileSync(path.join(dir, 'assets.json'), JSON.stringify(assetsMap));
    }
  });

  const app = new WebpackDevServer(compiler, _.merge({}, config.devServer, {
    reporter: ({state, stats}) => {
      if (state) {
        logger("bundle is now VALID.");
      } else {
        logger("bundle is now INVALID.");
      }
      reporter(null, stats);
    }
  }));

  logger(`Webpack ${config.name} dev server listening on ${config.devServer.port}`);
  app.listen(config.devServer.port);
}

function useWebpackDll() {
  console.log("Using Webpack DLL vendor bundle");
  const jsonPath = path.join('..', pkg.app.frontendBuildDir, 'vendor_dll.json');
  clientConfig.plugins.push(new webpack.DllReferencePlugin({
    context: process.cwd(),
    manifest: require(jsonPath) // eslint-disable-line import/no-dynamic-require
  }));
  serverConfig.plugins.push(new webpack.DllReferencePlugin({
    context: process.cwd(),
    manifest: require(jsonPath) // eslint-disable-line import/no-dynamic-require
  }));
}

function isDllValid() {
  try {
    const hashesPath = path.join(pkg.app.frontendBuildDir, 'vendor_dll_hashes.json');
    if (!fs.existsSync(hashesPath)) {
      console.warn("Vendor DLL does not exists");
      return false;
    }
    let meta = JSON.parse(fs.readFileSync(hashesPath));
    if (!fs.existsSync(path.join(pkg.app.frontendBuildDir, meta.name))) {
      console.warn("Vendor DLL does not exists");
      return false;
    }
    if (!_.isEqual(meta.modules, dllConfig.entry.vendor)) {
      console.warn('Modules bundled into vendor DLL changed, need to rebuild it');
      return false;
    }

    let json = JSON.parse(fs.readFileSync(path.join(pkg.app.frontendBuildDir, 'vendor_dll.json')));

    for (let filename of Object.keys(json.content)) {
      if (filename.indexOf(' ') < 0) {
        if (!fs.existsSync(filename)) {
          console.warn("Vendor bundle need to be regenerated, file: " + filename + " is missing.");
          return false;
        }
        const hash = crypto.createHash('md5').update(fs.readFileSync(filename)).digest('hex');
        if (meta.hashes[filename] !== hash) {
          console.warn(`Hash for vendor DLL file ${filename} changed, need to rebuild vendor bundle`);
          return false;
        }
      }
    }

    return true;
  } catch (e) {
    console.warn('Error checking vendor bundle, regenerating it...', e);

    return false;
  }
}

function buildDll() {
  return new Promise((done) => {
    if (!isDllValid()) {
      console.log("Generating vendor DLL bundle...");

      const compiler = webpack(dllConfig);

      compiler.run((err, stats) => {
        let json = JSON.parse(fs.readFileSync(path.join(pkg.app.frontendBuildDir, 'vendor_dll.json')));
        const meta = { name: _.keys(stats.compilation.assets)[0], hashes: {}, modules: dllConfig.entry.vendor };
        for (let filename of Object.keys(json.content)) {
          if (filename.indexOf(' ') < 0) {
            meta.hashes[filename] = crypto.createHash('md5').update(fs.readFileSync(filename)).digest('hex');
            fs.writeFileSync(path.join(pkg.app.frontendBuildDir, 'vendor_dll_hashes.json'), JSON.stringify(meta));
          }
        }
        done();
      });
    } else {
      done();
    }
  });
}

function startWebpack() {
  startServer();
  startClient(clientConfig);
  startClient(androidConfig);
  startClient(iOSConfig);
  createMobileEntry();
}

if (!__DEV__ || !pkg.app.webpackDll) {
  startWebpack();
} else {
  buildDll().then(function() {
    useWebpackDll();
    startWebpack();
  });
}
