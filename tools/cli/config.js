const path = require('path');

const BASE_PATH = path.resolve(`${__dirname}/../..`);
const TEMPLATES_DIR = `${BASE_PATH}/tools/templates`;
const MODULE_TEMPLATES = `${TEMPLATES_DIR}/module`;
const MODULE_TEMPLATES_OLD = `${TEMPLATES_DIR}/module_old`;

const STACK_LIST = {
  client: 'react & react native',
  'client-angular': 'angular',
  'client-vue': 'vue',
  'server-scala': 'scala',
  server: 'node'
};

module.exports = {
  BASE_PATH,
  TEMPLATES_DIR,
  MODULE_TEMPLATES,
  MODULE_TEMPLATES_OLD,
  STACK_LIST
};
