const path = require('path');

const BASE_PATH = path.resolve(`${__dirname}/../..`);
const TEMPLATES_DIR = `${BASE_PATH}/tools/templates`;
const MODULE_TEMPLATES = `${TEMPLATES_DIR}/module`;
const MODULE_TEMPLATES_OLD = `${TEMPLATES_DIR}/module_old`;

const STACK_MAP = {
  client: {
    title: 'react & react native',
    name: 'react',
    subdirs: ['client', 'client-react', 'client-react-native', 'mobile']
  },
  'client-vue': {
    title: 'vue',
    name: 'vue',
    subdirs: ['client-vue']
  },
  'client-angular': {
    title: 'angular',
    name: 'angular',
    subdirs: ['client-angular']
  },
  'server-scala': {
    title: 'scala',
    name: 'scala',
    subdirs: ['server-scala']
  },
  server: {
    title: 'node',
    name: 'node',
    subdirs: ['server-ts', 'server']
  }
};

module.exports = {
  BASE_PATH,
  TEMPLATES_DIR,
  MODULE_TEMPLATES,
  MODULE_TEMPLATES_OLD,
  STACK_MAP
};
