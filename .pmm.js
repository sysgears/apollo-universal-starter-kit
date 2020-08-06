const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const getPluginUrl = plugin => `https://raw.githubusercontent.com/yarnpkg/berry/master/packages/plugin-${plugin}/bin/%40yarnpkg/plugin-${plugin}.js`

const REQUESTED_VERSION = require('./package.json').pm.split('@')[1];
const PLUGIN_LIST = fs.readFileSync('./.yarnrc.yml', 'utf-8')
  .split('\n')
  .filter(line => line.includes('.yarn/plugins/@yarnpkg/plugin-'))
  .map(line => line.replace(/^.*\.yarn\/plugins\/@yarnpkg\/plugin-(.*)\.cjs$/, '$1'));
const BERRY_URL = `https://raw.githubusercontent.com/yarnpkg/berry/%40yarnpkg/cli/${REQUESTED_VERSION}/packages/yarnpkg-cli/bin/yarn.js`;
const YARN_DIR = path.join(__dirname, '.yarn');
const RELEASES_DIR = path.join(YARN_DIR, 'releases');
const PLUGIN_DIR = path.join(YARN_DIR, 'plugins');
const BERRY_FILE = path.join(RELEASES_DIR, `yarn-${REQUESTED_VERSION}.js`);

let stats;
try {
  stats = fs.statSync(RELEASES_DIR);
} catch (e) {}
const CURRENT_BERRY_FILENAME = !stats ? null : fs.readdirSync(RELEASES_DIR)[0];
const CURRENT_VERSION = !stats ? null : path.basename(CURRENT_BERRY_FILENAME).slice(0, -path.extname(CURRENT_BERRY_FILENAME).length).replace('yarn-', '');

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
  require(BERRY_FILE);
}

const downloadFile = async (filePath, url) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);

    const request = https.get(url, response => {
      response.pipe(file);
      file.on('finish', () => {
        resolve();
      });
    }).on('error', err => {
      fs.unlink(filePath);
      console.err(err);
      reject();
    });
  });
}

const promises = []

if (CURRENT_VERSION !== REQUESTED_VERSION) {
  if (CURRENT_BERRY_FILENAME) {
    fs.rmdirSync(RELEASES_DIR, { recursive: true });
    fs.rmdirSync(PLUGIN_DIR, { recursive: true });
  }

  fs.mkdirSync(RELEASES_DIR, { recursive: true });

  promises.push(downloadFile(BERRY_FILE, BERRY_URL));
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
  await Promise.all(promises);
  launchBerry();
})();
