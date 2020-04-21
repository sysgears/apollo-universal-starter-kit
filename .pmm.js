const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const REQUESTED_VERSION = require('./package.json').engines.pm.split('@')[1];
const BERRY_URL = `https://raw.githubusercontent.com/yarnpkg/berry/%40yarnpkg/cli/${REQUESTED_VERSION}/packages/yarnpkg-cli/bin/yarn.js`;
const YARN_DIR = path.join(__dirname, '.yarn');
const RELEASES_DIR = path.join(YARN_DIR, 'releases');
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

if (CURRENT_VERSION !== REQUESTED_VERSION) {
  if (CURRENT_BERRY_FILENAME)
    fs.unlinkSync(path.join(RELEASES_DIR, CURRENT_BERRY_FILENAME));

  if (!fs.existsSync(YARN_DIR))
    fs.mkdirSync(YARN_DIR);

  if (!fs.existsSync(RELEASES_DIR))
    fs.mkdirSync(RELEASES_DIR);

  const file = fs.createWriteStream(BERRY_FILE);

  const request = https.get(BERRY_URL, response => {
    response.pipe(file);
    file.on('finish', () => {
      launchBerry();
    });
  }).on('error', err => {
    fs.unlink(BERRY_FILE);
    console.err(err);
  });
} else {
  launchBerry();
}
