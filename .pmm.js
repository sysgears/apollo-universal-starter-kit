const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const getPluginUrl = plugin => `https://raw.githubusercontent.com/yarnpkg/berry/master/packages/plugin-${plugin}/bin/%40yarnpkg/plugin-${plugin}.js`

const REQUESTED_VERSION = require('./package.json').pm.split('@')[1];
const YARNRC_YML_PATH = path.join(__dirname, '.yarnrc.yml');
const PLUGIN_LIST = !fs.existsSync(YARNRC_YML_PATH) ? [] : fs.readFileSync(YARNRC_YML_PATH, 'utf-8')
  .split('\n')
  .filter(line => line.includes('.yarn/plugins/@yarnpkg/plugin-'))
  .map(line => line.replace(/^.*\.yarn\/plugins\/@yarnpkg\/plugin-(.*)\.cjs$/, '$1'));
const YARN_URL = /^[0,1]\..*$/.test(REQUESTED_VERSION) ?
  `https://github.com/yarnpkg/yarn/releases/download/v${REQUESTED_VERSION}/yarn-${REQUESTED_VERSION}.js` :
  `https://raw.githubusercontent.com/yarnpkg/berry/%40yarnpkg/cli/${REQUESTED_VERSION}/packages/yarnpkg-cli/bin/yarn.js`;
const YARN_DIR = path.join(__dirname, '.yarn');
const RELEASES_DIR = path.join(YARN_DIR, 'releases');
const PLUGIN_DIR = path.join(YARN_DIR, 'plugins');
const YARN_BINARY = path.join(RELEASES_DIR, `yarn-${REQUESTED_VERSION}.cjs`);

let stats;
try {
  stats = fs.statSync(RELEASES_DIR);
} catch (e) {}
const CURRENT_YARN_BINARYNAME = !stats ? null : fs.readdirSync(RELEASES_DIR)[0];
const CURRENT_VERSION = !stats ? null : path.basename(CURRENT_YARN_BINARYNAME).slice(0, -path.extname(CURRENT_YARN_BINARYNAME).length).replace('yarn-', '');

const launchBerry = () => {
  const args = [];
  const isHeroku = 'HEROKU' in process.env || ('DYNO' in process.env && process.env.HOME === '/app');
  if (isHeroku) {
    process.env.YARN_GLOBAL_FOLDER = path.join(os.tmpdir(), '.yarn/global');
  }
  for (const arg of process.argv) {
    if (arg.indexOf('--production') === 0 || arg.indexOf('--ignore-engines') === 0)
      continue;
    else if (arg.indexOf('--frozen-lockfile') === 0)
      args.push('--immutable');
    else
      args.push(arg);
  }
  process.argv = args;
  delete process.env.YARN_PRODUCTION;
  require(YARN_BINARY);
}

const downloadFile = async (filePath, url) => {
  return new Promise((resolve, reject) => {
    const request = https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadFile(filePath, res.headers.location).then(resolve).catch(reject);
      } else if (res.statusCode !== 200) {
        reject(`Error downloading ${url}, status: ${res.statusCode}`)
      } else {
        const file = fs.createWriteStream(filePath);
        res.pipe(file);
        file.on('finish', () => {
            resolve();
        });
      }
    }).on('error', err => {
      console.log(err);
      fs.unlink(filePath);
      reject(err);
    });
  });
}

const promises = []

if (CURRENT_VERSION !== REQUESTED_VERSION) {
  if (CURRENT_YARN_BINARYNAME) {
    fs.rmdirSync(RELEASES_DIR, { recursive: true });
    fs.rmdirSync(PLUGIN_DIR, { recursive: true });
  }

  fs.mkdirSync(RELEASES_DIR, { recursive: true });

  promises.push(downloadFile(YARN_BINARY, YARN_URL));
}

for (const plugin of PLUGIN_LIST) {
  const pluginPath = path.join(PLUGIN_DIR, '@yarnpkg', `plugin-${plugin}.cjs`)
  if (!fs.existsSync(pluginPath)) {
    fs.mkdirSync(path.join(PLUGIN_DIR, '@yarnpkg'), { recursive: true });
    promises.push(downloadFile(pluginPath, getPluginUrl(plugin)));
  }
}

if (PLUGIN_LIST.length === 0) {
  fs.rmdirSync(PLUGIN_DIR, { recursive: true });
} else {
  const entries = fs.readdirSync(path.join(PLUGIN_DIR, '@yarnpkg'));
  for (const entry of entries) {
    const pluginName = entry.replace(/plugin-(.*)\.cjs/, '$1');
    if (!PLUGIN_LIST.includes(pluginName))
      fs.unlinkSync(path.join(PLUGIN_DIR, '@yarnpkg', `plugin-${pluginName}.cjs`));
  }
}

(async () => {
  try {
    await Promise.all(promises);
    launchBerry();
  } catch (err) {
    console.log(err);
  }
})();
