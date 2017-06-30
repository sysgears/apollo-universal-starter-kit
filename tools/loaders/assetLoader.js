/**
 * Copyright 2017-present, Callstack.
 * All rights reserved.
 *
 * MIT License
 *
 * Copyright (c) 2017 Mike Grabowski, SysGears INC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @flow
 */

const utils = require('loader-utils');
const util = require('util');
const hashAssetFiles = require('expo/tools/hashAssetFiles');
const size = require('image-size');
const path = require('path');
const hasha = require('hasha');
const AssetResolver = require('haul/src/resolvers/AssetResolver');

type Config = {
  platform: string,
  bundle?: boolean,
  root: string,
  outputPath?: string | ((path: string) => string),
  publicPath?: string | ((path: string) => string),
};

module.exports = async function assetLoader() {
  this.cacheable();

  const callback = this.async();

  const query = utils.getOptions(this) || {};
  const options = this.options[query.config] || {};
  const config: Config = Object.assign({}, options, query);

  let info: ?{ width: number, height: number, type: string };

  try {
    info = size(this.resourcePath);
  } catch (e) {
    // Asset is not an image
  }

  const filepath = this.resourcePath;
  const dirname = path.dirname(filepath);
  const url = path.relative(config.root, dirname);
  const type = path.extname(filepath).replace(/^\./, '');
  const assets = path.join('assets', config.bundle ? '' : config.platform);
  const suffix = `(@\\d+(\\.\\d+)?x)?(\\.(${config.platform}|native))?\\.${type}$`;
  const filename = path.basename(filepath).replace(new RegExp(suffix), '');
  const longname = `${`${url.replace(/\//g, '_')}_${filename}`
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')}.${type}`;

  const result = await new Promise((resolve, reject) =>
    this.fs.readdir(dirname, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    }));

  const map = AssetResolver.collect(result, {
    name: filename,
    type,
    platform: config.platform,
  });

  const scales = Object.keys(map)
    .map(s => Number(s.replace(/[^\d.]/g, '')))
    .sort();

  const pairs = await Promise.all(
    Object.keys(map).map(scale => {
      this.addDependency(path.join(dirname, map[scale].name));

      return new Promise((resolve, reject) =>
        this.fs.readFile(path.join(dirname, map[scale].name), (err, res) => {
          if (err) {
            reject(err);
          } else {
            let dest;

            if (config.bundle && config.platform === 'android') {
              switch (scale) {
                case '@0.75x':
                  dest = 'drawable-ldpi';
                  break;
                case '@1x':
                  dest = 'drawable-mdpi';
                  break;
                case '@1.5x':
                  dest = 'drawable-hdpi';
                  break;
                case '@2x':
                  dest = 'drawable-xhdpi';
                  break;
                case '@3x':
                  dest = 'drawable-xxhdpi';
                  break;
                case '@4x':
                  dest = 'drawable-xxxhdpi';
                  break;
                default:
                  throw new Error(`Unknown scale ${scale} for ${filepath}`);
              }

              dest = path.join(dest, longname);
            } else {
              const name = `${filename}${scale === '@1x' ? '' : scale}.${type}`;
              dest = path.join(assets, url, name);
            }

            resolve({
              destination: dest,
              content: res,
            });
          }
        }));
    }),
  );

  pairs.forEach(item => {
    let dest = item.destination;

    if (config.outputPath) {
      // support functions as outputPath to generate them dynamically
      dest = typeof config.outputPath === 'function'
        ? config.outputPath(dest)
        : path.join(config.outputPath, dest);
    }

    this.emitFile(dest, item.content);
  });

  let publicPath = `__webpack_public_path__ + ${JSON.stringify(path.join('/', assets, url))}`;

  if (config.publicPath) {
    // support functions as publicPath to generate them dynamically
    publicPath = JSON.stringify(
      typeof config.publicPath === 'function'
        ? config.publicPath(url)
        : path.join(config.publicPath, url),
    );
  }

  const hashes = pairs.map(item => hasha(item.content, { algorithm: 'md5' }));

  const asset = {
    __packager_asset: true,
    scales: scales,
    name: filename,
    type: type,
    hash: hashes.join(),
    ...info
  };
  asset.files = scales.map(scale => path.join(dirname, map[`@${scale}x`].name));
  if (config.bundle) {
    asset.fileSystemLocation = dirname;
  }
  const finalAsset = await hashAssetFiles(asset);
  this._module._asset = finalAsset;

  const assetStr = "{\n " + util.inspect(finalAsset).slice(1, -2) + `,\n  httpServerLocation: ${publicPath}` + "}";

  callback(
    null,
    `
    var AssetRegistry = require('react-native/Libraries/Image/AssetRegistry');
    module.exports = AssetRegistry.registerAsset(${assetStr});
    `,
  );
};

module.exports.raw = true;
