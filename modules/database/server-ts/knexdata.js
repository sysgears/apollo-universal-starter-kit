import * as glob from 'glob';
import * as path from 'path';

import settings from '@gqlapp/config';

// This code gathers migrations and seeds from all modules into two fake directories
// /module-migrations - contains all the migrations from all modules
// /module-seeds - contains all the seeds from all modules
// This hack is needed because knex do not support multiple dirs for migrations and seeds
// at the moment. When knex will support multiple dirs for migrations and seeds this hack can be removed
const fs = require('fs');
const Module = require('module');

const modulesDir = path.isAbsolute(__dirname) ? path.join(__dirname, '../..') : path.resolve('../../modules');
const virtualDirs = {
  [path.resolve('/module-migrations')]: glob.sync(path.join(modulesDir, '**/migrations')),
  [path.resolve('/module-seeds')]: glob.sync(path.join(modulesDir, '**/seeds'))
};
const virtualFiles = {};

const realResolve = Module._resolveFilename;
Module._resolveFilename = function fakeResolve(request, parent) {
  const normRequest = request.replace(/\\/g, '/');
  if (virtualFiles[normRequest]) {
    return virtualFiles[normRequest];
  } else {
    const result = realResolve(request, parent);
    return result;
  }
};

for (const virtualDir of Object.keys(virtualDirs)) {
  const realDirs = virtualDirs[virtualDir];
  for (const realDir of realDirs) {
    const realFiles = fs.readdirSync(realDir);
    for (const file of realFiles) {
      virtualFiles[path.join(virtualDir, file).replace(/\\/g, '/')] = path.join(realDir, file);
    }
  }
}

const origReaddir = fs.readdir;
fs.readdir = function() {
  const path = arguments[0];
  if (virtualDirs[path]) {
    let files = [];
    for (const dir of virtualDirs[path]) {
      files = files.concat(fs.readdirSync(dir));
    }
    arguments[arguments.length == 2 ? 1 : 2](null, files);
  }
  origReaddir.apply(fs, arguments);
};

const envSettings = {
  [process.env.NODE_ENV || 'development']: {
    ...settings.db,
    seeds: {
      directory: '/module-seeds' // fake dir created virtually by tools/knex
    },
    migrations: {
      directory: '/module-migrations' // fake dir created virtually by tools/knex
    },
    useNullAsDefault: true
  }
};

export const development = envSettings.development;
export const production = envSettings.production;
export const test = envSettings.test;
