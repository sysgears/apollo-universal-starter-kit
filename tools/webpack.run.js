import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import minilog from 'minilog'
import _ from 'lodash'
import crypto from 'crypto'
import VirtualModules from 'webpack-virtual-modules'

const pkg = require('../package.json');
import configs from './webpack.config'

minilog.enable();

const logBack = minilog('webpack-for-backend');
const logFront = minilog('webpack-for-frontend');

const [ serverConfig, clientConfig, dllConfig ] = configs;
const __WINDOWS__ = /^win/.test(process.platform);

let server;
let startBackend = false;

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
    server = spawn('node', [path], {stdio: [0, 1, 2]});
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
        pkg.app.frontendBuildDir :
        pkg.app.backendBuildDir;
      createDirs(dir);
      fs.writeFileSync(path.join(dir, 'stats.json'), JSON.stringify(stats.toJson()));
    }
  }
}

var frontendVirtualModules = new VirtualModules({'node_modules/backend_reload.js': ''});

function startClient() {
  try {
    const reporter = (...args) => webpackReporter(logFront, ...args);

    clientConfig.plugins.push(frontendVirtualModules);

    if (__DEV__) {
      if (pkg.app.reactHotLoader) {
        clientConfig.entry.bundle.unshift('react-hot-loader/patch');
      }
      clientConfig.entry.bundle.unshift(
          `webpack-dev-server/client?http://localhost:${pkg.app.webpackDevPort}/`,
          'webpack/hot/dev-server');
      clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin(),
          new webpack.NoEmitOnErrorsPlugin());
      clientConfig.output.path = '/';
      startWebpackDevServer(clientConfig, reporter);
    } else {
      const compiler = webpack(clientConfig);

      compiler.run(reporter);
    }
  } catch (err) {
    logFront(err.message, err.stack);
  }
}


let backendReloadCount = 0;
function increaseBackendReloadCount() {
  frontendVirtualModules.writeModule('node_modules/backend_reload.js',
    `module.exports = {default: ${backendReloadCount}};\n`);
  backendReloadCount++;
}

function startServer() {
  try {
    const reporter = (...args) => webpackReporter(logBack, ...args);

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

function startWebpackDevServer(clientConfig, reporter) {
  clientConfig.plugins.push(frontendVirtualModules);

  let compiler = webpack(clientConfig);

  compiler.plugin('done', stats => {
    const dir = pkg.app.frontendBuildDir;
    createDirs(dir);
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

  const app = new WebpackDevServer(compiler, {
    hot: true,
    contentBase: '/',
    publicPath: clientConfig.output.publicPath,
    headers: { 'Access-Control-Allow-Origin': '*' },
    proxy: {
      '*': `http://localhost:${pkg.app.apiPort}`
    },
    reporter: ({state, stats}) => {
      if (state) {
        logFront("bundle is now VALID.");
      } else {
        logFront("bundle is now INVALID.");
      }
      reporter(null, stats);
    }
  });

  logFront(`Webpack dev server listening on ${pkg.app.webpackDevPort}`);
  app.listen(pkg.app.webpackDevPort);
}

function useWebpackDll() {
  console.log("Using Webpack DLL vendor bundle");
  const jsonPath = path.join('..', pkg.app.frontendBuildDir, 'vendor_dll.json');
  clientConfig.plugins.push(new webpack.DllReferencePlugin({
    context:  process.cwd(),
    manifest: require(jsonPath)
  }));
  serverConfig.plugins.push(new webpack.DllReferencePlugin({
    context:  process.cwd(),
    manifest: require(jsonPath)
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
        if(!fs.existsSync(filename)) {
          console.warn("Vendor bundle need to be regenerated, file: " + filename + " is missing.");
          return false;
        }
        const hash = crypto.createHash('md5').update(fs.readFileSync(filename)).digest('hex');
        if(meta.hashes[filename] !== hash) {
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
        const meta = {name: _.keys(stats.compilation.assets)[0], hashes: {}, modules: dllConfig.entry.vendor};
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
  startClient();
}

if (!__DEV__ || !pkg.app.webpackDll) {
  startWebpack();
} else {
  buildDll().then(function() {
    useWebpackDll();
    startWebpack();
  });
}