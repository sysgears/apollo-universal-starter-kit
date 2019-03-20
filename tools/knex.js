// This file gathers migrations and seeds from all modules into two fake directories
// /module-migrations - contains all the migrations from all modules
// /module-seeds - contains all the seeds from all modules
// This hack is needed because knex do not support multiple dirs for migrations and seeds
// at the moment. When knex will support multiple dirs for migrations and seeds this hack can be removed
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const Module = require('module');

const modulesDir = path.join(__dirname, '../modules');
const virtualDirs = {
  '/module-migrations': glob.sync(path.join(modulesDir, '**/migrations')),
  '/module-seeds': glob.sync(path.join(modulesDir, '**/seeds'))
};
const virtualFiles = {};

const realResolve = Module._resolveFilename;
Module._resolveFilename = function fakeResolve(request, parent) {
  if (virtualFiles[request]) {
    return virtualFiles[request];
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
      virtualFiles[path.join(virtualDir, file)] = path.join(realDir, file);
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

require('knex/bin/cli');
