const path = require('path');

const BASE_PATH = path.resolve(`${__dirname}'/../..`);
const DATABASE_DIR = `${BASE_PATH}/packages/server/src/database`;
const MIGRATIONS_DIR = `${DATABASE_DIR}/migrations`;
const SEEDS_DIR = `${DATABASE_DIR}/seeds`;
const TEMPLATES_DIR = `${BASE_PATH}/tools/templates`;
const MODULE_TEMPLATES = `${TEMPLATES_DIR}/module`;
const CRUD_TEMPLATES = `${TEMPLATES_DIR}/crud`;

module.exports = {
  BASE_PATH,
  DATABASE_DIR,
  MIGRATIONS_DIR,
  SEEDS_DIR,
  TEMPLATES_DIR,
  MODULE_TEMPLATES,
  CRUD_TEMPLATES
};
