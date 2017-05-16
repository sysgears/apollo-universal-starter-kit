import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
// import { spawn } from 'child_process';
import ReactPackager from 'react-native/packager';

const ENTRY_JS = '\
global.__react = require("react");\n\
global.__reactNative = require("react-native");\n\
global.__expo = require("expo");\n\
';

export default function createMobileEntry() {
  const entryRoot = path.resolve('.expo');
  mkdirp.sync(entryRoot);
  const entryPath = path.join(entryRoot, 'index.js');
  fs.writeFileSync(entryPath, ENTRY_JS);

  ReactPackager.buildBundle({
    blacklistRE: /(node_modules[\/\\]react[\/\\]dist[\/\\].*|website\/node_modules\/.*|Libraries\/Relay\/relay\/tools\/relayUnstableBatchedUpdates\.js|heapCapture\/bundle\.js|\/native\/node_modules\/.*)$/,
    projectRoots: [ entryRoot, path.resolve('.') ],
    assetExts: [ 'bmp', 'gif', 'jpg', 'jpeg', 'png', 'psd', 'svg', 'webp', 'm4v',
      'mov', 'mp4', 'mpeg', 'mpg', 'webm', 'aac', 'aiff', 'caf', 'm4a', 'mp3', 'wav', 'html', 'pdf', 'ttf'],
    nonPersistent: true,
    reporter: {
      update() {
        console.log("update args:", arguments);
      }
    },
    transformModulePath: path.resolve('./node_modules/react-native/packager/transformer.js')
  }, {
    entryFile: entryPath,
    dev: true,
    minify: false,
    platform: 'android',
    generateSourceMaps: true
  }).then(result => {
    const source = result.getSource();
    const sourceMap = result.getSourceMapString({minify: false, dev: true});
    console.log("source len:", source.length);
    console.log("source map len:", sourceMap.length);
  });

  // const args = [
  //   './node_modules/react-native/local-cli/cli.js', 'start',
  //   '--port', 19000,
  //   '--blacklistRE', '/native/node_modules/.*',
  //   '--projectRoots', [ entryRoot, path.resolve('.') ],
  //   '--root', entryRoot,
  //   '--assetExts', [ 'ttf' ]
  // ];
  // console.log("args:", args);
  // spawn('node', args, { stdio: [0, 1, 2] });
}