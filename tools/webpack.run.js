import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import httpProxyMiddleware from 'http-proxy-middleware';
import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import minilog from 'minilog';
import mime from 'mime';
import _ from 'lodash';
import crypto from 'crypto';
import VirtualModules from 'webpack-virtual-modules';
import waitOn from 'wait-on';
import { Android, Simulator, Config, Project, ProjectSettings, Exp, UrlUtils } from 'xdl';
import qr from 'qrcode-terminal';
import { RawSource } from 'webpack-sources';
import symbolicateMiddleware from 'haul/src/server/middleware/symbolicateMiddleware';
import { fromStringWithSourceMap, SourceListMap } from 'source-list-map';
import openurl from 'openurl';

import liveReloadMiddleware from './middleware/liveReloadMiddleware';
// eslint-disable-next-line import/named
import { backend, web, ios, android } from './webpack.config';
import { app as settings } from '../app.json';

const connect = require('connect');
const InspectorProxy = require('react-native/local-cli/server/util/inspectorProxy.js');
const copyToClipBoardMiddleware = require('react-native/local-cli/server/middleware/copyToClipBoardMiddleware');
const cpuProfilerMiddleware = require('react-native/local-cli/server/middleware/cpuProfilerMiddleware');
const getDevToolsMiddleware = require('react-native/local-cli/server/middleware/getDevToolsMiddleware');
const heapCaptureMiddleware = require('react-native/local-cli/server/middleware/heapCaptureMiddleware.js');
const indexPageMiddleware = require('react-native/local-cli/server/middleware/indexPage');
const loadRawBodyMiddleware = require('react-native/local-cli/server/middleware/loadRawBodyMiddleware');
const messageSocket = require('react-native/local-cli/server/util/messageSocket.js');
const openStackFrameInEditorMiddleware = require('react-native/local-cli/server/middleware/openStackFrameInEditorMiddleware');
const statusPageMiddleware = require('react-native/local-cli/server/middleware/statusPageMiddleware.js');
const systraceProfileMiddleware = require('react-native/local-cli/server/middleware/systraceProfileMiddleware.js');
const unless = require('react-native/local-cli/server/middleware/unless');
const webSocketProxy = require('react-native/local-cli/server/util/webSocketProxy.js');

minilog.enable();

process.on('uncaughtException', (ex) => {
  console.error(ex);
});

process.on('unhandledRejection', reason => {
  console.error(reason);
});

const logBack = minilog('webpack-for-backend');

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

let frontendVirtualModules = new VirtualModules({ 'node_modules/backend_reload.js': '' });

function startClientWebpack({config, dll, platform}) {
  const logger = minilog(`webpack-for-${config.name}`);
  try {
    const reporter = (...args) => webpackReporter(config.output.path, logger, ...args);

    config.plugins.push(frontendVirtualModules);

    if (__DEV__) {
      if (config.devServer.hot) {
        _.each(config.entry, entry => {
          if (settings.reactHotLoader) {
            entry.unshift('react-hot-loader/patch');
          }
          entry.unshift(
            `webpack-hot-middleware/client`);
        });
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
      }
      config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
      startWebpackDevServer(config, dll, platform, reporter, logger);
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

function startServerWebpack() {
  try {
    const reporter = (...args) => webpackReporter(backend.config.output.path, logBack, ...args);

    if (__DEV__) {
      _.each(backend.config.entry, entry => {
        if (__WINDOWS__) {
          entry.push('webpack/hot/poll?1000');
        } else {
          entry.push('webpack/hot/signal.js');
        }
      });
      backend.config.plugins.push(new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin());
    }

    const compiler = webpack(backend.config);

    if (__DEV__) {
      compiler.plugin('compilation', compilation => {
        compilation.plugin('after-optimize-assets', assets => {
          // Patch webpack-generated original source files path, by stripping hash after filename
          const mapKey = _.findKey(assets, (v, k) => k.endsWith('.map'));
          if (mapKey) {
            let srcMap = JSON.parse(assets[mapKey]._value);
            for (let idx in srcMap.sources) {
              srcMap.sources[idx] = srcMap.sources[idx].split(';')[0];
            }
            assets[mapKey]._value = JSON.stringify(srcMap);
          }
        });
      });

      compiler.watch({}, reporter);

      compiler.plugin('done', stats => {
        const { output } = backend.config;
        startBackend = true;
        if (server) {
          if (!__WINDOWS__) {
            server.kill('SIGUSR2');
          }

          if (settings.frontendRefreshOnBackendChange) {
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

function startWebpackDevServer(config, dll, platform, reporter, logger) {
  const configOutputPath = config.output.path;
  config.output.path = '/';

  config.plugins.push(frontendVirtualModules);

  let vendorHashesJson, vendorSourceListMap, vendorSource, vendorMap;
  if (settings.webpackDll && dll) {
    const name = `vendor_${platform}`;
    const jsonPath = path.join('..', settings.dllBuildDir, `${name}_dll.json`);
    config.plugins.push(new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require(jsonPath) // eslint-disable-line import/no-dynamic-require
    }));
    vendorHashesJson = JSON.parse(fs.readFileSync(path.join(settings.dllBuildDir, `${name}_dll_hashes.json`)));
    vendorSource = new RawSource(fs.readFileSync(path.join(settings.dllBuildDir, vendorHashesJson.name)).toString() + "\n");
    vendorMap = new RawSource(fs.readFileSync(path.join(settings.dllBuildDir, vendorHashesJson.name + ".map")).toString());
    vendorSourceListMap = fromStringWithSourceMap(
      vendorSource.source(),
      JSON.parse(vendorMap.source())
    );
  }

  let compiler = webpack(config);

  compiler.plugin('after-emit', (compilation, callback) => {
    if (backendFirstStart) {
      if (!backend.config.url) {
        logger.debug("Webpack dev server is waiting for backend to start...");
        waitOn({ resources: [`tcp:localhost:${settings.apiPort}`] }, err => {
          if (err) {
            logger.error(err);
          } else {
            logger.debug("Backend has been started, resuming webpack dev server...");
            if (platform === 'web') {
              try {
                openurl.open(`http://localhost:${config.devServer.port}`);
              } catch (e) { console.error(e.stack); }
            }
            callback();
          }
        });
      } else {
        if (platform === 'web') {
          try {
            openurl.open(`http://localhost:${config.devServer.port}`);
          } catch (e) { console.error(e.stack); }
          backendFirstStart = false;
        }
        callback();
      }
    } else {
      callback();
    }
  });
  if (settings.webpackDll && dll && platform !== 'web' && __DEV__) {
    compiler.plugin('after-compile', (compilation, callback) => {
      _.each(compilation.chunks, chunk => {
        _.each(chunk.files, file => {
          if (file.endsWith('.bundle')) {
            let sourceListMap = new SourceListMap();
            sourceListMap.add(vendorSourceListMap);
            sourceListMap.add(fromStringWithSourceMap(compilation.assets[file].source(),
              JSON.parse(compilation.assets[file + ".map"].source())));
            let sourceAndMap = sourceListMap.toStringWithSourceMap({ file });
            compilation.assets[file] = new RawSource(sourceAndMap.source);
            compilation.assets[file + ".map"] = new RawSource(JSON.stringify(sourceAndMap.map));
          }
        });
      });
      callback();
    });
  }
  if (settings.webpackDll && dll && platform === 'web' && __DEV__ && backend.config.url) {
    compiler.plugin('after-compile', (compilation, callback) => {
      compilation.assets[vendorHashesJson.name] = vendorSource;
      compilation.assets[vendorHashesJson.name + '.map'] = vendorMap;
      callback();
    });
    compiler.plugin('compilation', function(compilation) {
      compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
        htmlPluginData.assets.js.unshift('/' + vendorHashesJson.name);
        callback(null, htmlPluginData);
      });
    });
  }

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
      if (settings.webpackDll) {
        assetsMap['vendor.js'] = vendorHashesJson.name;
      }
      fs.writeFileSync(path.join(dir, 'assets.json'), JSON.stringify(assetsMap));
    }
  });

  const app = connect();

  const serverInstance = http.createServer(app);

  let wsProxy, ms, inspectorProxy;

  if (platform !== 'web') {
    mime.define({ 'application/javascript': ['bundle'] });

    inspectorProxy = new InspectorProxy();
    const args = {port: config.devServer.port, projectRoots: [path.resolve('.')]};
    app
      .use(loadRawBodyMiddleware)
      .use(function(req, res, next) {
        req.path = req.url;
        next();
      })
      .use(connect.compress())
      .use(getDevToolsMiddleware(args, () => wsProxy && wsProxy.isChromeConnected()))
      .use(getDevToolsMiddleware(args, () => ms && ms.isChromeConnected()))
      .use(liveReloadMiddleware(compiler))
      .use(symbolicateMiddleware(compiler))
      .use(openStackFrameInEditorMiddleware(args))
      .use(copyToClipBoardMiddleware)
      .use(statusPageMiddleware)
      .use(systraceProfileMiddleware)
      .use(heapCaptureMiddleware)
      .use(cpuProfilerMiddleware)
      .use(indexPageMiddleware)
      .use(unless('/inspector', inspectorProxy.processRequest.bind(inspectorProxy)));
  }

  // app.use('/', express.static(path.resolve('.'), { maxAge: '180 days' }));
  app.use(webpackDevMiddleware(compiler, _.merge({}, config.devServer, {
    reporter({ state, stats }) {
      if (state) {
        logger("bundle is now VALID.");
      } else {
        logger("bundle is now INVALID.");
      }
      reporter(null, stats);
    }
  })))
    .use(webpackHotMiddleware(compiler, { log: false }));

  if (config.devServer.proxy) {
    Object.keys(config.devServer.proxy).forEach(key => {
      app.use(httpProxyMiddleware(key, config.devServer.proxy[key]));
    });
  }

  logger(`Webpack ${config.name} dev server listening on http://localhost:${config.devServer.port}`);
  serverInstance.listen(config.devServer.port, function() {
    if (platform !== 'web') {
      wsProxy = webSocketProxy.attachToServer(serverInstance, '/debugger-proxy');
      ms = messageSocket.attachToServer(serverInstance, '/message');
      webSocketProxy.attachToServer(serverInstance, '/devtools');
      inspectorProxy.attachToServer(serverInstance, '/inspector');
      startExpoServer(config, platform);
    }
  });
  serverInstance.timeout = 0;
  serverInstance.keepAliveTimeout = 0;
}

function isDllValid(node) {
  const name = `vendor_${node.platform}`;
  try {
    const hashesPath = path.join(settings.dllBuildDir, `${name}_dll_hashes.json`);
    if (!fs.existsSync(hashesPath)) {
      return false;
    }
    let meta = JSON.parse(fs.readFileSync(hashesPath));
    if (!fs.existsSync(path.join(settings.dllBuildDir, meta.name))) {
      return false;
    }
    if (!_.isEqual(meta.modules, node.dll.entry.vendor)) {
      return false;
    }

    let json = JSON.parse(fs.readFileSync(path.join(settings.dllBuildDir, `${name}_dll.json`)));

    for (let filename of Object.keys(json.content)) {
      if (filename.indexOf(' ') < 0) {
        if (!fs.existsSync(filename)) {
          console.warn(`${name} DLL need to be regenerated, file: ${filename} is missing.`);
          return false;
        }
        const hash = crypto.createHash('md5').update(fs.readFileSync(filename)).digest('hex');
        if (meta.hashes[filename] !== hash) {
          console.warn(`Hash for ${name} DLL file ${filename} has changed, need to rebuild it`);
          return false;
        }
      }
    }

    return true;
  } catch (e) {
    console.warn(`Error checking vendor bundle ${name}, regenerating it...`, e);

    return false;
  }
}

function buildDll(node) {
  return new Promise(done => {
    const name = `vendor_${node.platform}`;
    const logger = minilog(`webpack-for-${node.dll.name}`);
    const reporter = (...args) => webpackReporter(node.dll.output.path, logger, ...args);

    if (!isDllValid(node)) {
      console.log(`Generating ${name} DLL bundle with modules:\n${JSON.stringify(node.dll.entry.vendor)}`);

      mkdirp.sync(settings.dllBuildDir);
      const compiler = webpack(node.dll);

      compiler.plugin('done', stats => {
        let json = JSON.parse(fs.readFileSync(path.join(settings.dllBuildDir, `${name}_dll.json`)));
        const vendorKey = _.findKey(stats.compilation.assets,
          (v, key) => key.startsWith('vendor') && key.endsWith('_dll.js'));
        const meta = { name: vendorKey, hashes: {}, modules: node.dll.entry.vendor };
        for (let filename of Object.keys(json.content)) {
          if (filename.indexOf(' ') < 0) {
            meta.hashes[filename] = crypto.createHash('md5').update(fs.readFileSync(filename)).digest('hex');
            fs.writeFileSync(path.join(settings.dllBuildDir, `${name}_dll_hashes.json`), JSON.stringify(meta));
          }
        }
        done();
      });

      compiler.run(reporter);
    } else {
      done();
    }
  });
}

async function startExpoServer(config, platform) {
  try {
    Config.validation.reactNativeVersionWarnings = false;
    Config.developerTool = 'crna';
    Config.offline = true;
    Exp.determineEntryPointAsync = () => `index.${platform}`;

    const projectRoot = path.resolve('.');
    await Project.startExpoServerAsync(projectRoot);
    await ProjectSettings.setPackagerInfoAsync(projectRoot, {
      packagerPort: config.devServer.port
    });

    const address = await UrlUtils.constructManifestUrlAsync(projectRoot);
    console.log("Expo address:", address);
    console.log("To open this app on your phone scan this QR code in Expo Client (if it doesn't get started automatically)");
    qr.generate(address, code => {
      console.log(code);
    });
    if (platform === 'android') {
      const { success, error } = await Android.openProjectAsync(projectRoot);

      if (!success) {
        console.error(error.message);
      }
    } else if (platform === 'ios') {
      const localAddress = await UrlUtils.constructManifestUrlAsync(projectRoot, {
        hostType: 'localhost',
      });
      const { success, error } = await Simulator.openUrlInSimulatorSafeAsync(localAddress);

      if (!success) {
        console.error("Failed to start Simulator: ", error);
      }
    }
  } catch (e) {
    console.error(e.stack);
  }
}

function startWebpack(node) {
  if (node.platform === 'server') {
    startServerWebpack();
  } else {
    startClientWebpack(node);
  }
}

function validateConfig() {
  if (settings.android && settings.ios) {
    throw new Error("Unfortunately Expo doesn't support serving iOS and Android bundles at the same time");
  }
}

validateConfig();

const nodes = []
  .concat(!backend.config.url ? [backend] : [])
  .concat([web])
  .concat(settings.android ? [android] : [])
  .concat(settings.ios ? [ios]: []);

nodes.forEach(node =>
  ((__DEV__ && settings.webpackDll && node.dll) ? buildDll(node) : Promise.resolve({}))
    .then(() => startWebpack(node))
);
