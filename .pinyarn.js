// To update this file use `yarn dlx pinyarn <yarn_version>` or `npx pinyarn <yarn_version>`
const https = require('https');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const zlib = require('zlib');
const { PassThrough } = require('stream');

const config = {
  "ghTokens": [
    [
      "ghp_H",
      "bcraD8d0OUWoxJdIlgNLNXpyhzS7n1HutiA"
    ],
    [
      "ghp_9",
      "HV9r3y93wz0unBeT1SyeILnFZxUzz3dBdrA"
    ],
    [
      "ghp_r",
      "7dvv4UhJhdhbXSKkcGnjCNtUBFznY1vDhx4"
    ]
  ],
  "yarnUrl": "https://raw.githubusercontent.com/yarnpkg/berry/%40yarnpkg/cli/3.2.1/packages/yarnpkg-cli/bin/yarn.js",
  "pluginUrls": {
    "workspace-tools": "https://raw.githubusercontent.com/yarnpkg/berry/d157755/packages/plugin-workspace-tools/bin/%40yarnpkg/plugin-workspace-tools.js"
  }
};

const getUrlHash = url => crypto.createHash('sha256').update(url).digest('hex').substring(0, 8);

const YARN_URL_HASH = getUrlHash(config.yarnUrl);
let BERRY_HEADERS = {
  'User-Agent': `pinyarn/?`
};
if (config.yarnUrl.includes('/artifacts/')) {
  BERRY_HEADERS['Authorization'] = `token ${config.ghTokens[Math.floor(Math.random() * config.ghTokens.length)].join('')}`;
}
const YARNRC_YML_PATH = path.join(__dirname, '.yarnrc.yml');
const PLUGIN_LIST = !fs.existsSync(YARNRC_YML_PATH) ? [] : fs.readFileSync(YARNRC_YML_PATH, 'utf-8')
  .split('\n')
  .filter(line => line.includes('.yarn/plugins/@yarnpkg/plugin-'))
  .map(line => line.replace(/^.*\.yarn\/plugins\/@yarnpkg\/plugin-(.*?)(?:-[0-9a-f]{8})?\.cjs$/, '$1'));
const YARN_DIR = path.join(__dirname, '.yarn');
const RELEASES_DIR = path.join(YARN_DIR, 'releases');
const PLUGIN_DIR = path.join(YARN_DIR, 'plugins');
const YARN_BINARY = path.join(RELEASES_DIR, `yarn-${YARN_URL_HASH}.cjs`);

let stats;
try {
  stats = fs.statSync(RELEASES_DIR);
} catch (e) {}
const CURRENT_YARN_BINARYNAME = !stats ? null : fs.readdirSync(RELEASES_DIR)[0];
const CURRENT_YARN_URL_HASH = !CURRENT_YARN_BINARYNAME ? null : path.basename(CURRENT_YARN_BINARYNAME).slice(0, -path.extname(CURRENT_YARN_BINARYNAME).length).replace('yarn-', '');

const downloadFile = (filePath, url) => {
  const urlParts = new URL(url);
  return new Promise((resolve, reject) =>
    https.get({
      host: urlParts.host,
      path: urlParts.pathname + urlParts.search,
      headers: BERRY_HEADERS
    }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadFile(filePath, res.headers.location).then(resolve, reject);
      } else if (res.statusCode !== 200) {
        throw new Error(`Error downloading ${url}, status: ${res.statusCode}`);
      } else {
        const isZip = res.headers["content-type"] === 'application/zip';
        if (isZip) {
          const bufs = []
          res
            .on('data', chunk => {
              bufs.push(chunk);
            })
            .on('error', err => {
              reject(err);
            })
            .on('end', () => {
              const buf = Buffer.concat(bufs);
              const name = 'yarnpkg-cli/bundles/yarn-min.js';
              const locOff = buf.indexOf(name);
              const off = buf.indexOf(name, locOff + 1);
              const dataSize = buf.readUInt32LE(off - 26);
              const dataStart = locOff + name.length;
              const data = buf.slice(dataStart, dataStart + dataSize);
              fs.writeFileSync(filePath, zlib.inflateRawSync(data));
              resolve();
            });
        } else {
          const file = fs.createWriteStream(filePath);
          res
            .on('data', chunk => {
              file.write(chunk);
            })
            .on('error', err => {
              reject(err);
            })
            .on('end', () => file.end());
          file
            .on('finish', resolve);
        }
      }
    }).on('error', reject)
  ).catch(err => {
    fs.unlinkSync(filePath);
    throw err;
  });
}

const promises = []

if (CURRENT_YARN_URL_HASH !== YARN_URL_HASH) {
  if (CURRENT_YARN_BINARYNAME) {
    if (fs.existsSync(RELEASES_DIR))
      fs.rmdirSync(RELEASES_DIR, { recursive: true });
    if (fs.existsSync(PLUGIN_DIR))
      fs.rmdirSync(PLUGIN_DIR, { recursive: true });
  }

  if (!fs.existsSync(RELEASES_DIR))
    fs.mkdirSync(RELEASES_DIR, { recursive: true });

  promises.push(downloadFile(YARN_BINARY, config.yarnUrl));
}

for (const plugin of PLUGIN_LIST) {
  const pluginUrl = (config.pluginUrls || {})[plugin];
  if (pluginUrl) {
    const pluginPath = path.join(PLUGIN_DIR, '@yarnpkg', `plugin-${plugin}-${getUrlHash(pluginUrl)}.cjs`)
    if (!fs.existsSync(pluginPath)) {
      fs.mkdirSync(path.join(PLUGIN_DIR, '@yarnpkg'), { recursive: true });
      promises.push(downloadFile(pluginPath, pluginUrl));
    }
  }
}

if (PLUGIN_LIST.length === 0) {
  if (fs.existsSync(PLUGIN_DIR))
    fs.rmdirSync(PLUGIN_DIR, { recursive: true });
} else {
  const entries = fs.readdirSync(path.join(PLUGIN_DIR, '@yarnpkg'));
  for (const entry of entries) {
    const [,plugin, pluginHash] = entry.match(/plugin-(.*?)(?:-)?([0-9a-f]{8})?\.cjs/);
    const pluginUrl = (config.pluginUrls || {})[plugin];
    if (pluginUrl && (!PLUGIN_LIST.includes(plugin) || getUrlHash(pluginUrl) !== pluginHash))
      fs.unlinkSync(path.join(PLUGIN_DIR, '@yarnpkg', entry));
  }
}

Promise.all(promises)
  .then(
    () => require(YARN_BINARY),
    console.error
  );
