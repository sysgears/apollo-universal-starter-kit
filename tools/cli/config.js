const path = require('path');

const BASE_PATH = path.resolve(`${__dirname}/../..`);
const TEMPLATES_DIR = `${BASE_PATH}/tools/templates`;
const MODULE_TEMPLATES = `${TEMPLATES_DIR}/module`;
const MODULE_TEMPLATES_OLD = `${TEMPLATES_DIR}/module_old`;
const LIST_STACKS = {
  // TODO: Add in next step.

  // react: 'client',
  // 'react native': 'mobile',
  angular: 'client-angular',
  vue: 'client-vue',
  node: 'server-ts',
  scala: 'server-scala'
};

module.exports = {
  BASE_PATH,
  TEMPLATES_DIR,
  MODULE_TEMPLATES,
  MODULE_TEMPLATES_OLD,
  LIST_STACKS
};
