import * as tmp from 'tmp';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

import settings from '../../../settings';

tmp.setGracefulCleanup();

const migrationTmpDir = tmp.dirSync({ unsafeCleanup: true });
const seedTmpDir = tmp.dirSync({ unsafeCleanup: true });
const symlinkFiles = (dirList, symLinkDir) =>
  dirList.forEach(dir => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const target = path.resolve(path.join(dir, file));
      const symlink = path.join(symLinkDir, file);
      if (!fs.existsSync(symlink) && fs.statSync(target).isFile()) {
        fs.symlinkSync(target, symlink);
      }
    });
  });

const modulesDir = path.isAbsolute(__dirname) ? path.join(__dirname, '../..') : path.resolve('../../modules');

// Find and symlink all application modules migrations and seeds into tmp dirs
const migrationDirs = glob.sync(path.join(modulesDir, '**/migrations'));
const seedDirs = glob.sync(path.join(modulesDir, '**/seeds'));

symlinkFiles(migrationDirs, migrationTmpDir.name);
symlinkFiles(seedDirs, seedTmpDir.name);

const envSettings = {
  [process.env.NODE_ENV || 'development']: {
    ...settings.db,
    seeds: {
      directory: seedTmpDir.name
    },
    migrations: {
      directory: migrationTmpDir.name
    },
    useNullAsDefault: true
  }
};

export const development = envSettings.development;
export const production = envSettings.production;
export const test = envSettings.test;
